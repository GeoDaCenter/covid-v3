import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { NavInlineButton } from './MapButtons'
import { useViewport } from '../../contexts/Viewport'
import { share } from '../../config/svg'
import { getURLParams } from '../../utils'
import { paramsSelectors } from '../../stores/paramsStore'
const {selectCurrentData, selectMapParams, selectDataParams} = paramsSelectors
/**
 * Standalone share button for use in map controls. Uses Web Navigator ShareAPI
 * with input form fallback.
 */
export default function ShareButton() {
  const viewport = useViewport()
  const currentData = useSelector(selectCurrentData)
  const mapParams = useSelector(selectMapParams)
  const dataParams = useSelector(selectDataParams)

  const [shared, setShared] = useState(false)

  const handleShare = async (params) => {
    const shareData = {
      title: 'The US Covid Atlas',
      text: 'Near Real-Time Exploration of the COVID-19 Pandemic.',
      url: `${window.location.href.split('?')[0]}${getURLParams(params)}`,
    }

    try {
      await navigator.share(shareData)
    } catch (err) {
      let copyText = document.querySelector('#share-url')
      copyText.value = `${shareData.url}`
      copyText.style.display = 'block'
      copyText.select()
      copyText.setSelectionRange(0, 99999)
      document.execCommand('copy')
      copyText.style.display = 'none'
      setShared(true)
      setTimeout(() => setShared(false), 5000)
    }
  }

  return (
    <NavInlineButton
      title="Share this Map"
      id="shareButton"
      shareNotification={shared}
      onClick={() =>
        handleShare({
          mapParams,
          dataParams,
          currentData,
          coords: viewport,
          dateIndex: dataParams.nIndex,
        })
      }
    >
      {share}
    </NavInlineButton>
  )
}
