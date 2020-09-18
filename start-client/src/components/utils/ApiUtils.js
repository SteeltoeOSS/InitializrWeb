import get from 'lodash.get'
import querystring from 'querystring'
import set from 'lodash.set'

import Extend from '../../Extend.json'
import {isInRange, parseReleases, parseVersion} from './Version'

const PROPERTIES_MAPPING_URL = {
  steeltoeVersion: 'steeltoe',
  dotNetFramework: 'dotNetFramework',
  dotNetTemplate: 'template',
  language: 'language',
  project: 'meta.projectName',
  application: 'meta.application',
  description: 'meta.description',
  namespace: 'meta.namespace',
  dependencies: 'dependencies',
}

export const getInfo = function getInfo(url) {
  return new Promise((resolve, reject) => {
    fetch(`${url}`, {
      method: 'GET',
      headers: {
        Accept: 'application/vnd.initializr.v2.2+json',
      },
    })
      .then(
        response => response.json(),
        () => {
          reject()
          return null
        }
      )
      .then(data => {
        if (data) {
          resolve(data)
        }
      })
  })
}

export const getShareUrl = values => {
  const props = {}
  Object.keys(PROPERTIES_MAPPING_URL).forEach(key => {
    const key2 = get(PROPERTIES_MAPPING_URL, key)
    const value = get(values, key2)
    if (key !== 'dependencies') {
      set(props, key, value)
    }
  })
  let params = `${querystring.stringify(props)}`
  if (get(values, 'dependencies', []).length > 0) {
    params = `${params}&dependencies=${get(values, 'dependencies').join(',')}`
  }
  return params
}

export const isValidParams = params => {
  return (
    Object.keys(params)
      .map(entry => {
        return !!get(PROPERTIES_MAPPING_URL, entry, null)
      })
      .filter(item => !!item).length > 0
  )
}

export const parseParams = (values, queryParams, lists) => {
  const errors = {}
  const warnings = {}
  if (isValidParams(queryParams)) {
    Object.keys(queryParams).forEach(entry => {
      const key = get(PROPERTIES_MAPPING_URL, entry)
      if (key) {
        const value = get(queryParams, entry, '').toLowerCase()
        switch (key) {
          case 'projectName':
          case 'template':
          case 'language':
          case 'dotNetFramework': {
            const list = get(lists, key, [])
            const res = list.find(a => a.key.toLowerCase() === value)
            let error = false
            if (res) {
              set(values, key, res.key)
            } else {
              error = true
              let versionMajor = value
              if (versionMajor.indexOf('.x') === -1) {
                versionMajor = get(parseVersion(versionMajor), 'major', '')
              }
              if (versionMajor.indexOf('.x') > -1) {
                const releases = parseReleases(list).filter(
                  release =>
                    release.major.toLowerCase() === versionMajor.toLowerCase()
                )
                if (releases.length > 0) {
                  const release = releases.reduce((p, c) => {
                    if (p.qualify > c.qualify) {
                      return p
                    }
                    if (p.qualify === c.qualify) {
                      if (p.minor > c.minor) {
                        return p
                      }
                    }
                    return c
                  }, releases[0])

                  if (release) {
                    error = false
                    set(values, key, release.version)
                    const currentValue = list.find(
                      a => a.key.toLowerCase() === release.version.toLowerCase()
                    )
                    set(warnings, key, {
                      value: get(queryParams, entry, ''),
                      select: currentValue.text,
                    })
                  }
                }
              }
            }
            if (error) {
              set(errors, 'steeltoe', {
                value: get(queryParams, entry, ''),
              })
            }
            break
          }
          case 'dependencies': {
            const depsWarning = []
            const newVal = value
              .split(',')
              .map(item => {
                const dep = get(lists, 'dependencies').find(
                  d => d.id === item.trim()
                )
                if (dep) {
                  return dep.id
                }
                depsWarning.push(item)
                return null
              })
              .filter(item => !!item)

            if (depsWarning.length > 0) {
              set(warnings, key, {
                value: depsWarning.join(', '),
              })
            }
            set(values, key, newVal)
            break
          }
          default:
            set(values, key, get(queryParams, entry, ''))
        }
      }
    })
  }
  return {
    values,
    errors,
    warnings,
  }
}

export const getLists = json => {
  const deps = []
  get(json, 'dependencies.values', []).forEach(group => {
    group.values.forEach(item => {
      const extend = Extend.find(it => it.id === get(item, 'id', ''))
      const val = {
        id: `${get(item, 'id', '')}`,
        name: `${get(item, 'name', '')}`,
        group: `${group.name}`,
        description: `${get(item, 'description', '')}`,
        versionRange: `${get(item, 'versionRange', '')}`,
        versionRequirement: `${get(item, 'versionRange', '')}`,
        weight: get(extend, 'weight', 50),
      }
      deps.push(val)
    })
  })
  return {
    project: get(json, 'type.values', [])
      .filter(type => type.action === '/starter.zip')
      .map(type => ({
        key: `${type.id}`,
        text: `${type.name}`,
      })),
    steeltoe: get(json, 'steeltoeVersion.values', []).map(steeltoe => ({
      key: `${steeltoe.id}`,
      text: `${steeltoe.name}`,
    })),
    dotNetFramework: get(json, 'dotNetFramework.values', []).map(dotNetFramework => ({
      key: `${dotNetFramework.id}`,
      text: `${dotNetFramework.name}`,
    })),
    template: get(json, 'dotNetTemplate.values', []).map(template => ({
      key: `${template.id}`,
      text: `${template.name}`,
    })),
    language: get(json, 'language.values', []).map(language => ({
      key: `${language.id}`,
      text: `${language.name}`,
    })),
    // meta: {
    // },
    dependencies: deps,
  }
}

export const getDefaultValues = json => {
  return {
    steeltoe: get(json, 'steeltoeVersion.default'),
    dotNetFramework: get(json, 'dotNetFramework.default'),
    template: get(json, 'dotNetTemplate.default'),
    language: get(json, 'language.default'),
    meta: {
      application: get(json, 'application.default'),
      projectName: get(json, 'project.default'),
      description: get(json, 'description.default'),
      namespace: get(json, 'namespace.default'),
    },
    dependencies: [],
  }
}

export const getConfig = json => {
  return {
    lists: getLists(json),
    defaultValues: getDefaultValues(json),
  }
}

export const isValidDependency = function isValidDependency(steeltoe, dependency) {
  if (!dependency) {
    return false
  }
  return get(dependency, 'versionRange')
    ? isInRange(steeltoe, get(dependency, 'versionRange'))
    : true
}

export const getProject = function getProject(url, values, config) {
  return new Promise((resolve, reject) => {
    const params = querystring.stringify({
      template: get(values, 'template'),
      language: get(values, 'language'),
      steeltoeVersion: get(values, 'steeltoe'),
      baseDir: get(values, 'meta.project'),
      projectName: get(values, 'meta.project'),
      application: get(values, 'meta.application'),
      description: get(values, 'meta.description'),
      namespace: get(values, 'meta.namespace'),
    })
    let paramsDependencies = get(values, 'dependencies', [])
      .map(dependency => {
        const dep = config.find(it => it.id === dependency)
        return isValidDependency(get(values, 'steeltoe'), dep) ? dependency : null
      })
      .filter(dep => !!dep)
      .join(',')

    if (paramsDependencies) {
      paramsDependencies = `&dependencies=${paramsDependencies}`
    }
    fetch(`${url}?${params}${paramsDependencies}`, {
      method: 'GET',
    }).then(
      response => {
        if (response.status === 200) {
          resolve(response.blob())
          return
        }
        reject()
      },
      () => {
        reject()
      }
    )
  })
}
