export default (destX, destY, duration, easingFn) => {
    let startTime = utils.getTime(),
        destTime = startTime + duration

    function step() {
        let now = utils.getTime(),
            newX, newY,
            easing

        if (now >= destTime) {
            this.isAnimating = false
            this._translate(destX, destY)

            if (!this.resetPosition(this.bounceTime)) {
                this._execEvent('scrollEnd')
            }

            return
        }

        now = (now - startTime) / duration
        easing = easingFn(now)
        newX = (destX - this.x) * easing + this.x
        newY = (destY - this.y) * easing + this.y
        that._translate(newX, newY)

        if (that.isAnimating) {
            rAF(step)
        }
    }

    this.isAnimating = true
    step()
}