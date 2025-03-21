import get from 'lodash/get'

const FILE_EXTENSION = {
  config: 'xml',
  cs: 'csharp',
  csproj: 'xml',
  Dockerfile: 'docker',
  fs: 'fsharp',
  fsproj: 'xml',
  http: 'http',
  json: 'javascript',
  gitignore: 'git',
  js: 'javascript',
  json: 'javascript',
  md: 'markdown',
  properties: 'properties',
  yaml: 'yaml',
  yml: 'yaml',
  xml: 'xml',
}

export const getLanguage = file => {
  let extension
  if (file.includes(`.`)) {
    extension = file.split(`.`).pop()
  } else {
    extension = file
  }
  return get(FILE_EXTENSION, extension, null)
}

export const createTree = (files, path, fileName, zip) => {
  return new Promise(resolve => {
    const recursive = (pfiles, ppath, pfileName, pzip, pdepth) => {
      const type = pfiles[ppath].dir ? 'folder' : 'file'
      const item = {
        type,
        filename: pfileName,
        path: `/${ppath}`,
        hidden: pdepth === 1 && type === 'folder' ? true : null,
      }
      if (type === 'folder') {
        const children = []
        pzip.folder(ppath).forEach((relativePath, file) => {
          const pathArray = relativePath.split('/')
          if (pathArray.length === 1 || (file.dir && pathArray.length === 2)) {
            children.push(
              recursive(
                pfiles,
                ppath + relativePath,
                relativePath,
                pzip,
                pdepth + 1
              )
            )
          }
        })
        item.children = children.sort((a, b) => (a.path > b.path ? 1 : -1))
        item.filename = pfileName.substring(0, pfileName.length - 1)
      } else {
        item.language = getLanguage(item.filename)
        if (item.language) {
          pfiles[ppath].async('string').then(content => {
            item.content = content
          })
        }
      }
      return item
    }
    const tree = recursive(files, path, fileName, zip, 0)
    const selected = tree.children.find(
      item =>
        ['Program.cs', 'Startup.cs', 'Program.fs', 'Startup.fs'].indexOf(item.filename) >
        -1
    )
    if (selected) {
      files[selected.path.substring(1)].async('string').then(content => {
        selected.content = content
        resolve({ tree, selected })
      })
    } else {
      resolve({ tree, selected: null })
    }
  })
}

export const findRoot = zip => {
  const root = Object.keys(zip.files).filter(filename => {
    const pathArray = filename.split('/')
    if (zip.files[filename].dir && pathArray.length === 2) {
      return true
    }
    return false
  })[0]
  return root.substring(0, root.length - 1)
}
