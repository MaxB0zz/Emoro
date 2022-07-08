window.onload = function () {

    const resizer = document.getElementById("resizer")
    let pageY, currentRow, nextRow, currentRowHeight, nextRowHeight

    resizer.addEventListener("mousedown", function (e) {
        console.log('op')
        currentRow = document.getElementById("console")
        nextRow = document.getElementById("editor")
        pageY = e.pageY
        currentRowHeight = currentRow.offsetHeight
        if (nextRow) {
            nextRowHeight = nextRow.offsetHeight
        }
    })

    document.addEventListener("mousemove", function (e) {
        if (currentRow) {
            let diffY = e.pageY - pageY

            if (nextRow) {
                nextRow.style.height = (nextRowHeight + diffY) + 'px'
                currentRow.style.height = (currentRowHeight - diffY) + 'px'
            }
        }
    })

    document.addEventListener("mouseup", function (e) {
        currentRow = undefined
        nextRow = undefined
        pageY = undefined
        nextRowHeight = undefined
        currentRowHeight = undefined
    })
}