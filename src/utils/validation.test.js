const expect = require('expect')

const {isRealString} = require('./isRealString');


describe('is Read String' , () => {

    it('should reject non-string values.', () => {
        let res = isRealString(65)
        expect(res).toBe(false)
    })

    it('should reject with only space.', () => {
        let res = isRealString('       ')
        expect(res).toBe(false)
    })

    it('should allow string with non-space chars.', () => {
        let res = isRealString('   YOO    ')
        expect(res).toBe(true)
    })
        
})