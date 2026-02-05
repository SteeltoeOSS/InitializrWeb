import get from 'lodash/get'
import React, { useContext, useEffect, useRef, useState } from 'react'
import { CSSTransition, TransitionGroup } from 'react-transition-group'
import { clearAllBodyScrollLocks, disableBodyScroll } from 'body-scroll-lock'

import Header from './Header'
import { AppContext } from '../../reducer/App'
import { IconGithub, IconHistory, IconFavorite } from '../icons'
import BuildVersion from '../../../../BuildVersion.json'

function SideLeft() {
  const [isOpen, setIsOpen] = useState(false)
  const [lock, setLock] = useState(false)
  const [status, setStatus] = useState('close')
  const wrapper = useRef(null)

  const { nav, histories, dispatch, favorites } = useContext(AppContext)

  useEffect(() => {
    if (get(wrapper, 'current') && nav) {
      disableBodyScroll(get(wrapper, 'current'))
    }
    return () => {
      clearAllBodyScrollLocks()
    }
  }, [wrapper, isOpen, nav])

  const onEnter = () => {
    const webVersion = document.getElementById('webVersion')
    if (webVersion) {
      webVersion.textContent = BuildVersion.label
    }
    fetch('/api/about').then(response => {
      if (!response.ok) {
        console.log("HTTP error getting About: -S", response.status)
        return
      }
      response.json().then(about => {
        const apiVersion = document.getElementById('apiVersion')
        if (apiVersion) {
          apiVersion.textContent = about.version
        }
        const configVersion = document.getElementById('configVersion')
        if (configVersion) {
          configVersion.textContent = about.commit.substring(0, 7)
        }
      })
    })
    setLock(true)
    setStatus('opening')
    setTimeout(() => {
      setIsOpen(true)
      setStatus('open')
    }, 350)
  }
  const onEntered = () => {
    setLock(false)
  }

  const onEnded = () => {
    setLock(true)
    setIsOpen(false)
    setStatus('closing')
  }
  const onExited = () => {
    setLock(false)
    setStatus('close')
  }
  return (
    <>
      <div
        id='side-left'
        className={`${isOpen ? 'is-open' : ''} ${
          status === 'opening' ? 'is-opening' : ''
        } ${status === 'closing' ? 'is-closing' : ''}`}
      >
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

            <TransitionGroup component={null}>
              {(status === 'close' || status === 'closing') && (
                <CSSTransition classNames='navgiation-actions' timeout={500}>
                  <div className='navgiation-actions'>
                    {favorites.length > 0 && (
                      <>
                        <div className='navigation-divider' />
                        <button
                          type='button'
                          aria-label='Menu'
                          aria-controls='navigation'
                          className='navigation-item'
                          onClick={() => {
                            dispatch({
                              type: 'UPDATE',
                              payload: { favorite: true },
                            })
                          }}
                        >
                          <IconFavorite />
                        </button>
                      </>
                    )}
                    {histories.length > 0 && (
                      <>
                        <div className='navigation-divider' />
                        <button
                          type='button'
                          aria-label='Menu'
                          aria-controls='navigation'
                          className='navigation-item'
                          onClick={() => {
                            dispatch({
                              type: 'UPDATE',
                              payload: { history: true },
                            })
                          }}
                        >
                          <IconHistory />
                        </button>
                      </>
                    )}
                  </div>
                </CSSTransition>
              )}
            </TransitionGroup>
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
                          href='https://docs.steeltoe.io/'
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
                          href='https://docs.steeltoe.io/articles/'
                        >
                          What&apos;s new with Steeltoe?
                        </a>
                      </li>
                      <li>
                        <a
                          id='ql-help-blog'
                          target='_blank'
                          rel='noopener noreferrer'
                          href='https://github.com/SteeltoeOSS/InitializrWeb/issues/new?assignees=&labels=feedback%2C+question&template=feedback-or-question.md&title=%5BFeedback%5D'
                        >
                          Leave feedback
                        </a>
                      </li>
                      <li>
                        <a
                          id='ql-help-migration2'
                          target='_blank'
                          rel='noopener noreferrer'
                          href='https://github.com/spring-projects/spring-boot/wiki/Spring-Boot-4.0-Migration-Guide'
                        >
                          Migrate Spring Boot 3.5 to 4.0
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
                    </ul>
                  </div>
                  <div className='copyright'>
                    © 2005-{new Date().getFullYear()} Broadcom. All Rights
                    Reserved.
                    <br />
                    The term &quot;Broadcom&quot; refers to Broadcom Inc. and/or
                    its subsidiaries
                    Powered by{' '}
                    <span>
                      <a
                        target='_blank'
                        rel='noopener noreferrer'
                        href='https://github.com/SteeltoeOSS/InitializrWeb'
                      >
                        InitializrWeb
                      </a>{' '}
                      <text id='webVersion' />
                    </span>
                    {', '}
                    <span>
                      <a
                        target='_blank'
                        rel='noopener noreferrer'
                        href='https://github.com/SteeltoeOSS/InitializrService'
                      >
                        InitializrService
                      </a>{' '}
                      <text id='apiVersion' />
                    </span>
                    {', and '}
                    <span>
                      <a
                        target='_blank'
                        rel='noopener noreferrer'
                        href='https://github.com/SteeltoeOSS/InitializrConfig/blob/main/SteeltoeInitializr.yaml'
                      >
                        InitializrConfig
                      </a>
                    </span>
                    <br />
                    <span>
                      Special thanks to the{' '}
                      <a
                        target='_blank'
                        rel='noopener noreferrer'
                        href='https://github.com/spring-io/initializr'
                      >
                        Spring Initializr
                      </a>
                      {' '}for inspiration and particularly to{' '}
                      <a
                        target='_blank'
                        rel='noopener noreferrer'
                        href='https://github.com/spring-io/start.spring.io'
                      >
                        start.spring.io
                      </a>
                      {' '}for providing the basis for our Web UI.
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
