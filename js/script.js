const clickRadius = 20  // px

function canvasClick(event) {
    const x = event.offsetX
    const y = event.offsetY

    const charges = window.charges
    
    let deleted = null

    for (let i = 0; i < charges.length; i++) {
        const charge = charges[i]
        const cx = charge[0]
        const cy = charge[1]

        const dist = Math.hypot(cx - x, cy - y)
        if (dist < clickRadius) {
            deleted = i
            break
        }
    }

    if (deleted === null) {
        const newCharge = event.ctrlKey ? -1 : 1
        charges.push([x, y, newCharge])
    } else {
        charges.splice(deleted, 1)
    }
    draw()
}

// https://stackoverflow.com/questions/25095548/how-to-draw-a-circle-in-html5-canvas-using-javascript
function drawCircle(ctx, x, y, radius, fill, stroke, strokeWidth) {
    ctx.beginPath()
    ctx.arc(x, y, radius, 0, 2 * Math.PI, false)
    if (fill) {
      ctx.fillStyle = fill
      ctx.fill()
    }
    if (stroke) {
      ctx.lineWidth = strokeWidth
      ctx.strokeStyle = stroke
      ctx.stroke()
    }
}


const arrowWidth = 8

function drawArrow(ctx, x, y, vx, vy, fill, thickness) {
    const len = Math.hypot(vx, vy)
    const nvx = vx / len
    const nvy = vy / len

    if (len === 0) {
        return
    }

    ctx.fillStyle = fill
    ctx.strokeStyle = fill
    ctx.lineWidth = thickness

    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + vx, y + vy);
    ctx.stroke();

    ctx.beginPath()
    ctx.moveTo(
        x + vx - nvy * arrowWidth / 2, 
        y + vy + nvx * arrowWidth / 2
    )
    ctx.lineTo(
        x + vx + nvy * arrowWidth / 2, 
        y + vy - nvx * arrowWidth / 2
    )
    ctx.lineTo(
        x + vx + nvx * arrowWidth * 2 / Math.sqrt(3),
        y + vy + nvy * arrowWidth * 2 / Math.sqrt(3)
    )
    ctx.closePath()
    ctx.fill()
}

function drawFieldArrow(ctx, x, y, charges) {
    let totalX = 0
    let totalY = 0

    for (let charge of charges) {
        const cx = charge[0]
        const cy = charge[1]

        const dx = cx - x
        const dy = cy - y
        const r = Math.hypot(dx, dy) / 40
        const E = charge[2] / (r * r)
        
        totalX += E * (-dx)
        totalY += E * (-dy)
    }

    const mag = Math.hypot(totalX, totalY)
    const ex = totalX / mag * 20
    const ey = totalY / mag * 20

    let c = mag * 30
    if (c > 255) {
        c = 255
    }
    let ccode = "rgb(" + c + "," + c + "," + c + ")"

    drawArrow(ctx, x, y, ex, ey, ccode, 2)
}

function draw() {
    const charges = window.charges
    const ctx = window.ctx
    
    ctx.fillStyle = "black";
    ctx.fillRect(0,0,800,800)

    for (let i = 0; i < 20; i++) {
        for (let j = 0; j < 20; j ++) {
            const x = i * 40 + 20;
            const y = j * 40 + 20;
            drawFieldArrow(ctx, x, y, charges)
        }
    }

   
    for (let charge of charges) {
        const q = charge[2]
        const color = q > 0 ? "red" : "blue"
        drawCircle(ctx, charge[0], charge[1], 10, color, null, null)
    }
}

function initPage() {
    const canvas = document.getElementById("main_canvas")
    const ctx = canvas.getContext("2d")
    window.ctx = ctx

    canvas.onclick = canvasClick
    window.charges = []

    draw()
}

window.onload = initPage