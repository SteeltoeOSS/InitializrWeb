import get from 'lodash.get'
import React, { useContext } from 'react'

import { IconTimes } from '../icons'
import { InitializrContext } from '../../reducer/Initializr'

function Warnings() {
  const { warnings, dispatch } = useContext(InitializrContext)
  if (Object.keys(warnings).length > 0) {
    return (
      <div className='warnings'>
        <a
          className='close'
          href='/#'
          onClick={event => {
            event.preventDefault()
            dispatch({
              type: 'CLEAR_WARNINGS',
            })
          }}
        >
          <IconTimes />
        </a>
        The following attributes could not be handled:
        <ul>
          {get(warnings, 'language') && (
            <li>
              <strong className='warn'>
                {get(warnings, 'language.value')}
              </strong>{' '}
              is not a valid language,{' '}
              <strong>{get(warnings, 'language.select')}</strong> has been
              selected.
            </li>
          )}
          {get(warnings, 'steeltoeVersion') && (
            <li>
              Steeltoe{' '}
              <strong className='warn'>{get(warnings, 'steeltoeVersion.value')}</strong> is
              not available, <strong>{get(warnings, 'steeltoeVersion.select')}</strong> has
              been selected.
            </li>
          )}
          {get(warnings, 'dotNetFramework') && (
            <li>
              DotNet Framework{' '}
              <strong className='warn'>{get(warnings, 'dotNetFramework.value')}</strong> is
              not available, <strong>{get(warnings, 'dotNetFramework.select')}</strong> has
              been selected.
            </li>
          )}
          {get(warnings, 'dependencies') && (
            <li>
              The following dependencies are not supported:{' '}
              <strong className='warn'>
                {get(warnings, 'dependencies.value')}
              </strong>
              .
            </li>
          )}
        </ul>
      </div>
    )
  }
  return <></>
}

export default Warnings
