'use client'
import { APIProvider, Map, useMap, useMapsLibrary } from '@vis.gl/react-google-maps'
import { useSearchParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'

const Intro = () => {
  const searchParams = useSearchParams()
  const lat1 = searchParams.get('lat1')
  const lng1 = searchParams.get('lng1')
  return (
    <div className='h-screen w-full'>
      <APIProvider
        apiKey='AIzaSyAJsQjlna7aQk-7UPb-h4H0v1holCNxIno'
      >
        <Map defaultCenter={{lat: lat1, lng: lng1}} defaultZoom={18} >
          <Directions lat1={lat1} lng1={lng1} />
        </Map>
      </APIProvider>
    </div>
  )
}

function Directions({ lat1, lng1 }) {
  const searchParams = useSearchParams()
  const lat2 = searchParams.get('lat2')
  const lng2 = searchParams.get('lng2')
  const map = useMap()
  const routesLibrary = useMapsLibrary('routes')
  const [directionsService, setDirectionsService] = useState()
  const [directionsRenderer, setDirectionsRenderer] = useState()
  const [routes, setRoutes] = useState([])

  useEffect(() => {
    if (!lat2 || !lng2 || !routesLibrary || !map) return;
    setDirectionsService(new routesLibrary.DirectionsService())
    setDirectionsRenderer(new routesLibrary.DirectionsRenderer({ map }))
  }, [lat2, lng2, routesLibrary, map])

  useEffect(() => {
    if (!lat1 || !lat2 || !lng1 || !lng2 || !directionsService || !directionsRenderer) return;
    directionsService.route({
      origin: new google.maps.LatLng(lat2, lng2),
      destination: new google.maps.LatLng(lat1, lng1),
      travelMode: google.maps.TravelMode.DRIVING,
    }).then(response => {
      console.log(response)
      directionsRenderer.setDirections(response)
    })
  }, [lat1, lat2, lng1, lng2, directionsService, directionsRenderer])

  return null
}

export default Intro
