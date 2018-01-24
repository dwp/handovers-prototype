class Benefit {
    constructor(properties) {
        this.id = properties.id
        this.benefitName = properties.benefitName;
        this.benefitAbbr = properties.benefitAbbr;
        this.benefitSubTypes = properties.benefitSubTypes;
    }
}

module.exports = Benefit;