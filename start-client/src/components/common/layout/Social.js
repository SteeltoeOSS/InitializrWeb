import React from 'react'

import { IconGithub, IconTwitter } from '../icons'

const Social = () => (
  <div className='social'>
    <a
      rel='noreferrer noopener'
      target='_blank'
      href='https://github.com/SteeltoeOSS/InitializrWeb'
    >
      <IconGithub />
    </a>
    <a
      rel='noreferrer noopener'
      target='_blank'
      href='https://twitter.com/SteeltoeOSS'
    >
      <IconTwitter />
    </a>
  </div>
)

export default Social
