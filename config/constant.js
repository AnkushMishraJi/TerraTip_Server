
exports.regex = {
    size: /^\d+\s?(sq\s?ft|sqft|sqm|m²)?$/i,
    phone: /^\d{10,15}$/,
    email: /^\S+@\S+\.\S+$/ 
}

exports.areaType = {
    urban: "URBAN",
    rural: "RURAL"
}

exports.landType = {
    commercial: "COMMERCIAL",
    residential: "RESIDENTIAL"
}