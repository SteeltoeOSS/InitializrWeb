import JSZip from 'jszip'
import fs from 'fs'
import get from 'lodash/get'
import path from 'path'

import { createTree, findRoot, getLanguage } from '../Zip'

/**
 * Function getLanguage
 */
describe('getLanguage', () => {
  it('should return the extension', () => {
    expect(getLanguage('index.md')).toBe('markdown')
    expect(getLanguage('index.spec.md')).toBe('markdown')
    expect(getLanguage('index.js')).toBe('javascript')
    expect(getLanguage('index.json')).toBe('javascript')
    expect(getLanguage('index.fs')).toBe('fsharp')
    expect(getLanguage('index.cs')).toBe('csharp')
    expect(getLanguage('index.fsproj')).toBe('xml')
    expect(getLanguage('index.csproj')).toBe('xml')
    expect(getLanguage('index.gitignore')).toBe('git')
    expect(getLanguage('index.xml')).toBe('xml')
    expect(getLanguage('index.config')).toBe('xml')
    expect(getLanguage('index.properties')).toBe('properties')
    expect(getLanguage('Dockerfile')).toBe('docker')
    expect(getLanguage('index.yml')).toBe('yaml')
    expect(getLanguage('index.yaml')).toBe('yaml')
    expect(getLanguage('Sample.http')).toBe('http')
  })
  it('should not return the extension', () => {
    expect(getLanguage('index.php')).toBe(null)
    expect(getLanguage('index.html')).toBe(null)
    expect(getLanguage('index.css')).toBe(null)
    expect(getLanguage('index.scss')).toBe(null)
    expect(getLanguage('mvnw')).toBe(null)
    expect(getLanguage('command.cmd')).toBe(null)
  })
})

/**
 * Function getLanguage
 */
describe('createTree', () => {
  // eslint-disable-next-line
  it('should create a tree', async() => {
    const zipJs = new JSZip()
    await fs.readFile(
      path.resolve('./dev/starter.mock.zip'),
      async (err, blob) => {
        const { files } = await zipJs.loadAsync(blob).catch(() => {
          throw Error(`Could not load the ZIP project.`)
        })
        const pathZ = `${findRoot({ files })}/`
        const result = await createTree(files, pathZ, pathZ, zipJs).catch(
          () => {
            throw Error(`Could not read the ZIP project.`)
          }
        )
        expect(get(result, 'tree', null) !== null).toBe(true)
        expect(get(result, 'tree.type', null)).toBe('folder')
        expect(get(result, 'tree.filename', null)).toBe('Sample')
        expect(get(result, 'tree.path', null)).toBe('/Sample/')
        expect(get(result, 'tree.hidden', null)).toBe(null)
        expect(get(result, 'tree.children').length).toBe(6)
        expect(get(result, 'selected.type')).toBe('file')
        expect(get(result, 'selected.filename')).toBe('Program.cs')
        expect(get(result, 'selected.path')).toBe('/Sample/Program.cs')
        expect(get(result, 'selected.language')).toBe('csharp')
      }
    )
  })
})

/**
 * Function getLanguage
 */
describe('findRoot', () => {
  // eslint-disable-next-line
  it('should return the right value', async() => {
    const zipJs = new JSZip()
    await fs.readFile(
      path.resolve('./dev/starter.mock.zip'),
      async (err, blob) => {
        const { files } = await zipJs.loadAsync(blob).catch(() => {
          throw Error(`Could not load the ZIP project.`)
        })
        const pathZ = `${findRoot({ files })}/`
        expect(pathZ).toBe('Sample/')
      }
    )
  })
})
