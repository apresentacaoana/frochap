'use client'
import { APIProvider, Map, useMap, useMapsLibrary } from '@vis.gl/react-google-maps'
import { useSearchParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'

const Intro = () => {
  const searchParams = useSearchParams()
  const {lat1, lng1, lat2, lng2} = searchParams
  return (
    <div className='h-screen w-full'>
      <APIProvider
        apiKey='AIzaSyAJsQjlna7aQk-7UPb-h4H0v1holCNxIno'
      >
        <Map defaultCenter={{lat: lat1, lng: lng1}} defaultZoom={17} >
          <Directions />
        </Map>
      </APIProvider>
    </div>
  )
}

function Directions() {
  const map = useMap()
  const routesLibrary = useMapsLibrary('routes')
  const [directionsService, setDirectionsService] = useState()
  const [directionsRenderer, setDirectionsRenderer] = useState()
  const [routes, setRoutes] = useState([])

  useEffect(() => {
    if(!routesLibrary || !map) return;
    setDirectionsService(new routesLibrary.DirectionsService())
    setDirectionsRenderer(new routesLibrary.DirectionsRenderer({ map }))
  }, [routesLibrary, map])

  useEffect(() => {
    if(!directionsService || !directionsRenderer) return;
    directionsService.route({
      origin: new google.maps.LatLng(lat2, lng2),
      destination: new google.maps.LatLng(lat1, lng1),
      travelMode: google.maps.TravelMode.DRIVING,
    }).then(response => {
      console.log(response)
      directionsRenderer.setDirections(response)
    })
  }, [directionsService, directionsRenderer])


  return null
}

export default Intro
