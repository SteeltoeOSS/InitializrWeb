import PropTypes from 'prop-types'
import get from 'lodash/get'
import set from 'lodash/set'
import React, { useReducer } from 'react'

import { getShareUrl, parseParams } from '../utils/ApiUtils'

export const defaultInitializrContext = {
  values: {
    language: '',
    steeltoeVersion: '',
    meta: {
      name: '',
      namespace: '',
      description: ''
    },
    dotNetFramework: '',
    packaging: '',
    dependencies: [],
  },
  share: '',
  errors: {},
  warnings: {},
}

const localStorage =
  typeof window !== 'undefined'
    ? window.localStorage
    : {
        getItem: () => {},
        setItem: () => {},
      }

const getPersistedOrDefault = json => {
  const values = {
    dotNetFramework:
      localStorage.getItem('dotNetFramework') || get(json, 'defaultValues').dotNetFramework,
    steeltoeVersion: get(json, 'defaultValues').steeltoeVersion,
    language:
      localStorage.getItem('language') || get(json, 'defaultValues').language,
    meta: {
      name: get(json, 'defaultValues.meta').name,
      namespace: get(json, 'defaultValues.meta').namespace,
      description: get(json, 'defaultValues.meta').description,
    },
    packaging: get(json, 'defaultValues').packaging,
    dependencies: [],
  }
  const checks = ['dotNetFramework', 'language']
  checks.forEach(key => {
    const item = get(json, `lists.${key}`)?.find(
      it => it.key === get(values, key)
    )
    if (!item) {
      set(values, key, get(json, `defaultValues.${key}`))
    }
  })
  return values
}

const persist = changes => {
  if (get(changes, 'dotNetFramework')) {
    localStorage.setItem('dotNetFramework', get(changes, 'dotNetFramework'))
  }
  if (get(changes, 'language')) {
    localStorage.setItem('language', get(changes, 'language'))
  }
}

export function reducer(state, action) {
  switch (action.type) {
    case 'COMPLETE': {
      const json = get(action, 'payload')
      const values = getPersistedOrDefault(json)
      return {
        values,
        share: getShareUrl(values),
        errors: {},
        warnings: {},
      }
    }
    case 'UPDATE': {
      const changes = get(action, 'payload')
      let errors = { ...state.errors }
      let meta = { ...get(state, 'values.meta') }
      if (get(changes, 'meta')) {
        meta = { ...meta, ...get(changes, 'meta') }
      }
      if (get(changes, 'steeltoeVersion')) {
        const {steeltoeVersion, ...err} = errors
        errors = err
      }
      if (get(changes, 'dotNetFramework')) {
        const {dotNetFramework, ...err} = errors
        errors = err
      }
      if (get(changes, 'language')) {
        const {language, ...err} = errors
        errors = err
      }
      if (get(changes, 'meta.name') !== undefined) {
        set(meta, 'namespace', `${get(meta, 'name')}`)
        set(meta, 'description', `${get(meta, 'name')} project`)
      }
      persist(changes)
      const values = {
        ...get(state, 'values'),
        ...changes,
        meta,
      }
      return { ...state, values, share: getShareUrl(values), errors }
    }
    case 'LOAD': {
      const params = get(action, 'payload.params')
      const lists = get(action, 'payload.lists')
      const { values, errors, warnings } = parseParams(
        state.values,
        params,
        lists
      )
      return { ...state, values, errors, warnings, share: getShareUrl(values) }
    }
    case 'ADD_DEPENDENCY': {
      const dependency = get(action, 'payload.id')
      const values = { ...get(state, 'values') }
      values.dependencies = [...get(values, 'dependencies'), dependency]
      return { ...state, values, share: getShareUrl(values) }
    }
    case 'REMOVE_DEPENDENCY': {
      const dependency = get(action, 'payload.id')
      const values = { ...get(state, 'values') }
      values.dependencies = [
        ...get(values, 'dependencies').filter(dep => dep !== dependency),
      ]
      return { ...state, values, share: getShareUrl(values) }
    }
    case 'CLEAR_WARNINGS': {
      return { ...state, warnings: {} }
    }
    default:
      return state
  }
}

export const InitializrContext = React.createContext({
  ...defaultInitializrContext,
})

export function InitializrProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, { ...defaultInitializrContext })
  return (
    <InitializrContext.Provider value={{ ...state, dispatch }}>
      {children}
    </InitializrContext.Provider>
  )
}

InitializrProvider.defaultProps = {
  children: null,
}

InitializrProvider.propTypes = {
  children: PropTypes.node,
}
