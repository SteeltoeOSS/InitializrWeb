import PropTypes from 'prop-types'
import get from 'lodash/get'
import React, { useContext, useRef, useState, useEffect } from 'react'

import Actions from './Actions'
import Control from './Control'
import FieldError from './FieldError'
import FieldInput from './FieldInput'
import FieldRadio from './FieldRadio'
import Warnings from './Warnings'
import useWindowsUtils from '../../utils/WindowsUtils'
import { AppContext } from '../../reducer/App'
import { Button, Radio } from '../form'
import { Dependency } from '../dependency'
import { InitializrContext } from '../../reducer/Initializr'

function Fields({
  onSubmit,
  onExplore,
  onShare,
  onFavoriteAdd,
  refExplore,
  refSubmit,
  refDependency,
  generating,
}) {
  const wrapper = useRef(null)
  const windowsUtils = useWindowsUtils()
  const [dropdown, setDropdown] = useState(false)
  const { config, dispatch, dependencies } = useContext(AppContext)
  const {
    values,
    dispatch: dispatchInitializr,
    errors,
  } = useContext(InitializrContext)
  const update = args => {
    dispatchInitializr({ type: 'UPDATE', payload: args })
  }

  useEffect(() => {
    const clickOutside = event => {
      const children = get(wrapper, 'current')
      if (children && !children.contains(event.target)) {
        setDropdown(false)
      }
    }
    document.addEventListener('mousedown', clickOutside)
    return () => {
      document.removeEventListener('mousedown', clickOutside)
    }
  }, [])

  return (
    <>
      <div className='colset colset-main'>
        <div className='left'>
          <Warnings />
          <div className='col-sticky'>
            <Control text='Project'>
              <FieldInput
                id='input-name'
                value={get(values, 'meta.name')}
                text='Name'
                onChange={event => {
                  update({ meta: { name: event.target.value } })
                }}
              />
              <FieldInput
                id='input-namespace'
                value={get(values, 'meta.namespace')}
                text='Namespace'
                onChange={event => {
                  update({ meta: { namespace: event.target.value } })
                }}
              />
              <FieldInput
                id='input-description'
                value={get(values, 'meta.description')}
                text='Description'
                onChange={event => {
                  update({ meta: { description: event.target.value } })
                }}
              />
            </Control>
            <Control text='Steeltoe'>
              <Radio
                name='steeltoeVersion'
                selected={get(values, 'steeltoeVersion')}
                error={get(errors, 'steeltoeVersion.value', '')}
                options={get(config, 'lists.steeltoeVersion')}
                onChange={value => {
                  dispatchInitializr({
                    type: 'UPDATE',
                    payload: {steeltoeVersion: value, dotNetFramework: get(values, 'dotNetFramework')},
                    config: get(dependencies, 'list'),
                  })
                  dispatch({
                    type: 'UPDATE_DEPENDENCIES',
                    payload: {steeltoeVersion: value, dotNetFramework: get(values, 'dotNetFramework')},
                  })
                }}
              />
              {get(errors, 'steeltoeVersion') && (
                <FieldError>
                  Steeltoe {get(errors, 'steeltoeVersion.value')} is not supported.
                  Please select a valid version.
                </FieldError>
              )}
            </Control>
            <Control text='.NET'>
              <Radio
                name='dotNetFramework'
                selected={get(values, 'dotNetFramework')}
                error={get(errors, 'dotNetFramework.value', '')}
                options={get(config, 'lists.dotNetFramework')}
                onChange={value => {
                  dispatchInitializr({
                    type: 'UPDATE',
                    payload: {dotNetFramework: value, steeltoeVersion: get(values, 'steeltoeVersion')},
                    config: get(dependencies, 'list'),
                  })
                  dispatch({
                    type: 'UPDATE_DEPENDENCIES',
                    payload: {dotNetFramework: value, steeltoeVersion: get(values, 'steeltoeVersion')},
                  })
                }}
              />
              {get(errors, 'dotNetFramework') && (
                <FieldError>
                  .NET {get(errors, 'dotNetFramework.value')} is not supported.
                  Please select a valid version.
                </FieldError>
              )}
            </Control>
            <Control text='Language'>
              <Radio
                name='language'
                selected={get(values, 'language')}
                options={get(config, 'lists.language')}
                onChange={value => {
                  update({ language: value })
                }}
              />
            </Control>
          </div>
        </div>
        <div className='right'>
          <Dependency refButton={refDependency} />
        </div>
      </div>
      <Actions>
        {generating ? (
          <span className='placeholder-button placeholder-button-submit placeholder-button-special'>
            Generating...
          </span>
        ) : (
          <Button
            id='generate-project'
            variant='primary'
            onClick={onSubmit}
            hotkey={`${windowsUtils.symb} + ⏎`}
            refButton={refSubmit}
            disabled={generating}
          >
            Generate
          </Button>
        )}
        <Button
          id='explore-project'
          onClick={onExplore}
          hotkey='Ctrl + Space'
          refButton={refExplore}
        >
          Explore
        </Button>

        <span className='dropdown' ref={wrapper}>
          <Button
            className={`last-child ${dropdown ? 'clicked' : ''}`}
            id='favorite-add'
            onClick={() => {
              setDropdown(true)
            }}
          >
            ...
          </Button>
          {dropdown && (
            <div className='dropdown-items'>
              <Button
                id='favorite-add'
                onClick={() => {
                  onFavoriteAdd()
                  setDropdown(false)
                }}
              >
                Bookmark
              </Button>
              <Button
                id='share-project'
                onClick={() => {
                  onShare()
                  setDropdown(false)
                }}
              >
                Share
              </Button>
            </div>
          )}
        </span>
      </Actions>
    </>
  )
}

Fields.propTypes = {
  generating: PropTypes.bool.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onExplore: PropTypes.func.isRequired,
  onShare: PropTypes.func.isRequired,
  onFavoriteAdd: PropTypes.func.isRequired,
  refExplore: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.shape({ current: PropTypes.instanceOf(Element) }),
  ]).isRequired,
  refSubmit: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.shape({ current: PropTypes.instanceOf(Element) }),
  ]).isRequired,
  refDependency: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.shape({ current: PropTypes.instanceOf(Element) }),
  ]).isRequired,
}

export default Fields
