import React from 'react'

import Actions from './Actions'
import Control from './Control'
import Placeholder from './Placeholder'

export default function Loading() {
  return (
    <>
      <div className='colset colset-main'>
        <div className='left'>
          <Control text='Project'>
            <div>
              <div className='control control-inline control-placeholder'>
                <span className='placeholder-label'>Name</span>
                <Placeholder type='input' />
              </div>
              <div className='control control-inline control-placeholder'>
                <span className='placeholder-label'>Namespace</span>
                <Placeholder type='input' />
              </div>
              <div className='control control-inline control-placeholder'>
                <span className='placeholder-label'>Description</span>
                <Placeholder type='input' />
              </div>
            </div>
          </Control>
          <Control text='Steeltoe'>
            <Placeholder type='radio' width='100px' />
          </Control>
          <Control text='.NET'>
            <Placeholder type='radio' width='100px' />
          </Control>
          <Control text='Language'>
            <Placeholder type='radio' width='100px' />
          </Control>
        </div>
        <div className='right'>
          <div className='control'>
            <div className='dependency-header'>
              <span className='label'>Dependencies</span>
              <Placeholder className='placeholder-button-dep' type='button' />
            </div>
          </div>
        </div>
      </div>
      <Actions>
        <Placeholder className='placeholder-button-submit' type='button' />
        <Placeholder className='placeholder-button-explore' type='button' />
        <Placeholder className='placeholder-button-share' type='button' />
      </Actions>
    </>
  )
}
