import React from 'react'

import { IconGithub, IconTwitter } from '../icons'

function Social() {
  return (
    <div className='social'>
      <a
        rel='noreferrer noopener'
        target='_blank'
        href='https://github.com/SteeltoeOSS/InitializrWeb'
      >
        <IconGithub />
      </a>
    </div>
  )
}

export default Social
