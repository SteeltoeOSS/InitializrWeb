import PropTypes from 'prop-types'
import get from 'lodash.get'
import React, {useContext} from 'react'

import Actions from './Actions'
import Control from './Control'
import FieldError from './FieldError'
import FieldInput from './FieldInput'
import FieldRadio from './FieldRadio'
import Warnings from './Warnings'
import useWindowsUtils from '../../utils/WindowsUtils'
import {AppContext} from '../../reducer/App'
import {Button, Radio} from '../form'
import {Dependency} from '../dependency'
import {InitializrContext} from '../../reducer/Initializr'

const Fields = ({
                  onSubmit,
                  onExplore,
                  onShare,
                  refExplore,
                  refSubmit,
                  refDependency,
                  generating,
                }) => {
  const windowsUtils = useWindowsUtils()
  const {config, dispatch, dependencies} = useContext(AppContext)
  const {values, dispatch: dispatchInitializr, errors} = useContext(
    InitializrContext
  )
  const update = args => {
    dispatchInitializr({type: 'UPDATE', payload: args})
  }

  return (
    <>
      <div className='colset colset-main'>
        <div className='left'>
          <Warnings/>
          <div className='col-sticky'>
            <Control text='Project'>
              <FieldInput
                id='input-name'
                value={get(values, 'meta.name')}
                text='Name'
                onChange={event => {
                  update({meta: {name: event.target.value}})
                }}
              />
              <FieldInput
                id='input-namespace'
                value={get(values, 'meta.namespace')}
                text='Namespace'
                onChange={event => {
                  update({meta: {namespace: event.target.value}})
                }}
              />
              <FieldInput
                id='input-applicationName'
                value={get(values, 'meta.applicationName')}
                text='Application'
                onChange={event => {
                  update({meta: {applicationName: event.target.value}})
                }}
              />
              <FieldInput
                id='input-description'
                value={get(values, 'meta.description')}
                text='Description'
                onChange={event => {
                  update({meta: {description: event.target.value}})
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
            <Control text='.NET Framework'>
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
                  .NET Framework {get(errors, 'dotNetFramework.value')} is not supported.
                  Please select a valid version.
                </FieldError>
              )}
            </Control>
            <Control text='.NET Template'>
              <Radio
                name='dotNetTemplate'
                selected={get(values, 'dotNetTemplate')}
                options={get(config, 'lists.dotNetTemplate')}
                onChange={value => {
                  update({dotNetTemplate: value})
                }}
              />
            </Control>
{/*            <Control text='Language'>
              <Radio
                name='language'
                selected={get(values, 'language')}
                options={get(config, 'lists.language')}
                onChange={value => {
                  update({language: value})
                }}
              />
            </Control>
 */}         </div>
        </div>
        <div className='right'>
          <Dependency refButton={refDependency}/>
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
        <Button id='share-project' onClick={onShare}>
          Share...
        </Button>
      </Actions>
    </>
  )
}

Fields.propTypes = {
  generating: PropTypes.bool.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onExplore: PropTypes.func.isRequired,
  onShare: PropTypes.func.isRequired,
  refExplore: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.shape({current: PropTypes.instanceOf(Element)}),
  ]).isRequired,
  refSubmit: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.shape({current: PropTypes.instanceOf(Element)}),
  ]).isRequired,
  refDependency: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.shape({current: PropTypes.instanceOf(Element)}),
  ]).isRequired,
}

export default Fields
