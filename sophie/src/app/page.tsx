'use client'
import { FC } from 'react'
import { useDraw } from './hooks/useDraw'

interface pageProps {}

const page: FC<pageProps> = ({}) => {
  const { canvasRef, onMouseDown } = useDraw(draw)

  function draw({prevPoint, currentPoint, ctx}: Draw) {
    const {x: currX, y: currY} = currentPoint;
    const lineColor = '#000'
    const lineWidth = 5

    let startPoint = prevPoint ?? currentPoint
    ctx.beginPath()
    ctx.lineWidth = lineWidth
    ctx.strokeStyle = lineColor
    ctx.moveTo(startPoint.x, startPoint.y)
    ctx.lineTo(currX, currY)
    ctx.stroke()

    ctx.fillStyle = lineColor
    ctx.beginPath()
    ctx.arc(startPoint.x, startPoint.y, 2, 0, 2 * Math.PI)
    ctx.fill()

  }

  return (
    <main className='w-screen h-screen flex justify-center items-center'>
        <canvas onMouseDown={onMouseDown} ref={canvasRef} width={1920} height={1080} className='w-screen h-screen border border-black'/>
    </main>
  )

}

export default page
