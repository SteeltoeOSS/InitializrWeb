import get from 'lodash.get'
import React, { useContext, useEffect, useRef, useState } from 'react'
import { CSSTransition, TransitionGroup } from 'react-transition-group'
import { clearAllBodyScrollLocks, disableBodyScroll } from 'body-scroll-lock'

import Header from './Header'
import { AppContext } from '../../reducer/App'
import { IconGithub, IconTwitter } from '../icons'

const SideLeft = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [lock, setLock] = useState(false)
  const wrapper = useRef(null)

  const { nav, dispatch } = useContext(AppContext)

  useEffect(() => {
    if (get(wrapper, 'current') && nav) {
      disableBodyScroll(get(wrapper, 'current'))
    }
    return () => {
      clearAllBodyScrollLocks()
    }
  }, [wrapper, isOpen, nav])

  const onEnter = () => {
    setLock(true)
    setTimeout(() => {
      setIsOpen(true)
    }, 350)
  }
  const onEntered = () => {
    setLock(false)
  }

  const onEnded = () => {
    setLock(true)
    setIsOpen(false)
  }
  const onExited = () => {
    setLock(false)
  }
  return (
    <>
      <div id='side-left' className={isOpen ? 'is-open' : ''}>
        <div className='side-container'>
          <div className='navigation-action'>
            <button
              className={`hamburger hamburger--spin ${nav ? 'is-active' : ''}`}
              type='button'
              aria-label='Menu'
              aria-controls='navigation'
              onClick={() => {
                if (lock) {
                  return
                }
                dispatch({ type: 'UPDATE', payload: { nav: !nav } })
              }}
            >
              <span className='hamburger-box' tabIndex='-1'>
                <span className='hamburger-inner' />
              </span>
            </button>
          </div>
          <div className='social'>
            <a
              rel='noreferrer noopener'
              target='_blank'
              href='https://github.com/SteeltoeOSS/InitializrWeb'
            >
              <span className='a-content' tabIndex='-1'>
                <IconGithub />
              </span>
            </a>
            <a
              rel='noreferrer noopener'
              target='_blank'
              href='https://twitter.com/SteeltoeOSS'
            >
              <span className='a-content' tabIndex='-1'>
                <IconTwitter />
              </span>
            </a>
          </div>
        </div>
      </div>
      <TransitionGroup component={null}>
        {nav && (
          <CSSTransition
            onEnter={onEnter}
            onEntered={onEntered}
            onExit={onEnded}
            onExited={onExited}
            classNames='navigation'
            timeout={500}
          >
            <div className='navigation' ref={wrapper}>
              <div className='navigation-content'>
                <div className='navigation-content-wrap'>
                  <Header />
                  <div>
                    <ul>
                      <li>
                        <a
                          id='ql-help-guides'
                          target='_blank'
                          rel='noopener noreferrer'
                          href='https://steeltoe.io/docs/'
                        >
                          Steeltoe documentation
                        </a>
                      </li>
                      <li>
                        <a
                          id='ql-help-projects'
                          target='_blank'
                          rel='noopener noreferrer'
                          href='https://github.com/SteeltoeOSS'
                        >
                          Steeltoe projects
                        </a>
                      </li>
                      <li>
                        <a
                          id='ql-help-blog'
                          target='_blank'
                          rel='noopener noreferrer'
                          href='https://steeltoe.io/blog/'
                        >
                          What&apos;s new with Steeltoe?
                        </a>
                      </li>
                      <li>
                        <a
                          id='ql-help-migrate'
                          target='_blank'
                          rel='noopener noreferrer'
                          href='https://docs-dev.steeltoe.io/api/v3/welcome/whats-new.html#breaking-changes'
                        >
                          Migrate Steeltoe 2.4.x to 3.0.x
                        </a>
                      </li>
                    </ul>
                  </div>
                  <div className='is-mobile'>
                    <ul>
                      <li>
                        <a
                          rel='noreferrer noopener'
                          target='_blank'
                          href='https://github.com/SteeltoeOSS/InitializrWeb'
                        >
                          <span className='a-content' tabIndex='-1'>
                            Github
                          </span>
                        </a>
                      </li>
                      <li>
                        <a
                          rel='noreferrer noopener'
                          target='_blank'
                          href='https://twitter.com/SteeltoeOSS'
                        >
                          <span className='a-content' tabIndex='-1'>
                            Twitter
                          </span>
                        </a>
                      </li>
                    </ul>
                  </div>
                  <div className='copyright'>
                    © 2016-{new Date().getFullYear()} VMware, Inc.
                    <br />
                    start.steeltoe.io is powered by{' '}
                    <span>
                      <a
                        target='_blank'
                        rel='noopener noreferrer'
                        href='https://github.com/SteeltoeOSS/InitializrApi/'
                      >
                        Steeltoe Initializr API
                      </a>
                    </span>{' '}
                    <span>and</span>{' '}
                    <span>
                      <a
                        target='_blank'
                        rel='noopener noreferrer'
                        href='https://dotnet.microsoft.com/'
                      >
                        Microsoft .NET
                      </a>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </CSSTransition>
        )}
      </TransitionGroup>
    </>
  )
}

export default SideLeft
