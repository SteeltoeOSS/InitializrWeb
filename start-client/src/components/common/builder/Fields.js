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

function Fields({
  onSubmit,
  onExplore,
  onShare,
  refExplore,
  refSubmit,
  refDependency,
  generating,
}) {
  const windowsUtils = useWindowsUtils()
  const { config, dispatch, dependencies } = useContext(AppContext)
  const {
    values,
    dispatch: dispatchInitializr,
    errors,
  } = useContext(InitializrContext)
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
                id='input-projectName'
                value={get(values, 'meta.projectName')}
                text='Name'
                onChange={event => {
                  update({meta: {projectName: event.target.value}})
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
                id='input-application'
                value={get(values, 'meta.application')}
                text='Application'
                onChange={event => {
                  update({meta: {application: event.target.value}})
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
                name='steeltoe'
                selected={get(values, 'steeltoe')}
                error={get(errors, 'steeltoe.value', '')}
                options={get(config, 'lists.steeltoe')}
                onChange={value => {
                  dispatchInitializr({
                    type: 'UPDATE',
                    payload: {steeltoe: value},
                    config: get(dependencies, 'list'),
                  })
                  dispatch({
                    type: 'UPDATE_DEPENDENCIES',
                    payload: {steeltoe: value},
                  })
                }}
              />
              {get(errors, 'steeltoe') && (
                <FieldError>
                  Steeltoe {get(errors, 'steeltoe.value')} is not supported.
                  Please select a valid version.
                </FieldError>
              )}
            </Control>
            <Control text='DotNet Framework'>
              <Radio
                name='dotNetFramework'
                selected={get(values, 'dotNetFramework')}
                error={get(errors, 'dotNetFramework.value', '')}
                options={get(config, 'lists.dotNetFramework')}
                onChange={value => {
                  dispatchInitializr({
                    type: 'UPDATE',
                    payload: {dotNetFramework: value},
                    config: get(dependencies, 'list'),
                  })
                  dispatch({
                    type: 'UPDATE_DEPENDENCIES',
                    payload: {dotNetFramework: value},
                  })
                }}
              />
              {get(errors, 'dotNetFramework') && (
                <FieldError>
                  Steeltoe {get(errors, 'dotNetFramework.value')} is not supported.
                  Please select a valid version.
                </FieldError>
              )}
            </Control>
            <Control text='Template'>
              <Radio
                name='template'
                selected={get(values, 'template')}
                options={get(config, 'lists.template')}
                onChange={value => {
                  update({template: value})
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
