import moment from "moment";
module.exports = class PriceData {
  constructor(
    transactionId,
    price,
    date,
    postCode,
    propertyType,
    isNewBuild,
    stateType,
    paon,
    secondaryAddress,
    street,
    locality,
    town,
    district,
    county,
    transactionCategory,
    recordStatus,
    lat,
    lng
  ) {
    this.setTransactionID(transactionId);
    this.setPricePaid(price);
    this.setDate(date);
    this.setPostCode(postCode);
    this.setPropertyType(propertyType);
    this.setIsNew(isNewBuild);
    this.setContractType(stateType);
    this.setPOAN(paon);
    this.setSAON(secondaryAddress);
    this.setStreet(street);
    this.setLocatlity(locality);
    this.setTown(town);
    this.setDistrict(district);
    this.setCounty(county);
    this.setTransactionCategory(transactionCategory);
    this.setRecordStatus(recordStatus);
    this.setLocation(lat, lng);
  }

  /**
   * Getter for property town
   * @retun town property located
   */
  getTown() {
    return this.town;
  }

  /**
   * Setter for property town
   * Property town located
   * @param {string} property town
   */
  setTown(town) {
    this.town = town || undefined;
  }

  /**
   * Getter for the property location
   * @return the coordinate object with latitude and longitude values in radians
   */
  getLocation() {
    return {
      latitude: this.lat,
      longitude: this.lng,
    };
  }

  /**
   * Setter for the property location
   * @param {number} latitude
   * @param {number} longitude
   */
  setLocation(lat, lng) {
    this.lat = lat;
    this.lng = lng;
  }

  /**
   * Getter for transaction id
   *A reference number which is generated automatically recording each published sale. The number is unique and will change each time a sale is recorded.
   * @return transaction id
   */
  getTransactionID() {
    return this.id;
  }

  /**
   * Setter for transaction id
   * A reference number which is generated automatically recording each published sale. The number is unique and will change each time a sale is recorded.
   * @param {string} transaction id
   */
  setTransactionID(id) {
    this.id = id || undefined;
  }

  /**
   * Setter for the date of transaction
   * Date when the sale was completed, as stated on the transfer deed.
   * @param {string} date of transaction
   */
  setDate(date) {
    if (date) this.date = moment(date);
    else this.date = undefined;
  }
  /**
   * Getter for date of transaction
   * Date when the sale was completed, as stated on the transfer deed.
   * @return {Date} date of transaction
   */
  getDate() {
    return this.date;
  }

  /**
   * This is the postcode used at the time of the original transaction. Note that postcodes can be reallocated and these changes are not reflected in the Price Paid Dataset.
   * @return postcode
   */
  getPostCode() {
    return this.postcode;
  }

  /**
   * Setter for the postcode
   * @param {string} postcode
   */
  setPostCode(postcode) {
    this.postcode = postcode || undefined;
  }

  /**
     * D = Detached, S = Semi-Detached, T = Terraced, F = Flats/Maisonettes, O = Other
  Note that:
  - we only record the above categories to describe property type, we do not separately identify bungalows
  - end-of-terrace properties are included in the Terraced category above
  - ‘Other’ is only valid where the transaction relates to a property type that is not covered by existing values, for example where a property comprises more than one large parcel of land
  @return property type
     */
  getPropertyType() {
    return this.propertyType;
  }

  setPropertyType(propertyType) {
    if (propertyType) {
      propertyType = propertyType.toUpperCase();

      switch (propertyType) {
        case "D":
          this.propertyType = "Detached";
          break;
        case "S":
          this.propertyType = "Semi-Detached";
          break;
        case "T":
          this.propertyType = "Terraced";
          break;
        case "F":
          this.propertyType = "Flat/Maisonette";
          break;
        case "O":
          this.propertyType = "Other";
          break;
      }
    } else this.propertyType = undefined;
  }

  /**
     * Getter for contract type
     * 	Relates to the tenure: F = Freehold, L= Leasehold etc.
  Note that HM Land Registry does not record leases of 7 years or less in the Price Paid Dataset.
     * @return contract tenure
     */
  getContractType() {
    return this.contractType;
  }

  /**
   * Indicates the age of the property
   * applies to all price paid transactions, residentital and non-residentail
   * @return true or false if building is new or not.
   */
  getIsNew() {
    return this.isNew;
  }

  /**
   * Setter for isNew property
   * Indicates the age of the property
   * applies to all price paid transactions, residentital and non-residentail
   * @param {string} Y = newly built, N = established building
   */
  setIsNew(isNew) {
    if (isNew) {
      isNew = isNew.toUpperCase();
      switch (isNew) {
        case "Y":
          this.isNew = true;
          break;
        case "N":
          this.isNew = false;
          break;
      }
    } else this.isNew = undefined;
  }

  /**
   * Relates to the tenure: F = Freehold,     * L= Leasehold etc.
   * Note that HM Land Registry does not      * record leases of 7 years or less in      * the Price Paid Dataset.
   * @param {string} contract duration
   */
  setContractType(stateType) {
    if (stateType) {
      stateType = stateType.toUpperCase();
      switch (stateType) {
        case "F":
          this.contractType = "Freehold";
          break;
        case "L":
          this.contractType = "Leasehold";
          break;
        default:
          this.contractType = "Other";
      }
    } else this.contractType = undefined;
  }

  /**
    * Getter for paon
    * Primary Addressable Object Name. Typically the house number or name.
    @return paon - primary address
    */
  getPAON() {
    return this.paon;
  }

  /**
   * Setter for paon
   * Secondary Addressable Object Name. Name, number or description used to identify the Basic Land and Property Unit (BLPU) within a larger BLPU. Typically this will be a floor or flat within a building. If there is no sub-building, e.g. flat, there will only be a PAON. If there is a sub-building there will be a SAON.
   * @param {string} poan
   */
  setPOAN(paon) {
    this.paon = paon || undefined;
  }

  /**
   * Getter for saon
   * Secondary Addressable Object Name. Name, number or description used to identify the Basic Land and Property Unit (BLPU) within a larger BLPU. Typically this will be a floor or flat within a building. If there is no sub-building, e.g. flat, there will only be a PAON. If there is a sub-building there will be a SAON.
   * @return saon - secondary address
   */
  getSAON() {
    return this.saon;
  }

  /**
   * Setter for soan
   * @param {string} soan - secondary address
   */
  setSAON(saon) {
    this.saon = saon || undefined;
  }

  /**
   * Date when the sale was completed, as stated on the transfer deed.
   * @return price paid for property
   */
  getPricePaid() {
    return this.pricepaid;
  }

  /**
   * Date when the sale was completed, as stated on the transfer deed.
   * @param {number} price paid for the property
   */
  setPricePaid(price) {
    this.pricepaid = price || undefined;
  }

  /**
   * Getter for property street
   * @return street where property is located
   */
  getStreet() {
    return this.street;
  }

  /**
   * Setter for the property of the street
   * @param {string} street where property is located
   */
  setStreet(street) {
    this.street = street || undefined;
  }

  /**
   * Getter for the property locality
   * @return locality
   */
  getLocality() {
    return this.locality;
  }

  /**
   * Setter for property locality
   * @param {string} property locality
   */
  setLocatlity(locality) {
    this.locality = locality || undefined;
  }

  /**
   * Getter for property districtt
   * @return district
   */
  getDistrict() {
    return this.district;
  }

  /**
   * Setter for the property district
   * @param {string} property district
   */
  setDistrict(district) {
    this.district = district || undefined;
  }

  /**
   * Getter for the property county
   * @return property county
   */
  getCounty() {
    return this.county;
  }

  /**
   * Setter for the property county
   * @param {string} property county
   */
  setCounty(county) {
    this.county = county || undefined;
  }

  /**
   * Getter for the transaction category
   * Indicates the type of Price Paid transaction.
  A = Standard Price Paid entry, includes single residential property sold for value.
  B = Additional Price Paid entry including transfers under a power of sale/repossessions, buy-to-lets (where they can be identified by a Mortgage), transfers to non-private individuals and sales where the property type is classed as ‘Other’.
   */
  getTransactionCategory() {
    return this.transactionCategory;
  }

  /**
   * Indicates the type of Price Paid transaction.
  A = Standard Price Paid entry, includes single residential property sold for value.
  B = Additional Price Paid entry including transfers under a power of sale/repossessions, buy-to-lets (where they can be identified by a Mortgage), transfers to non-private individuals and sales where the property type is classed as ‘Other’.
  * @param {string} transaction category
   */
  setTransactionCategory(transactionCategory) {
    if (transactionCategory) {
      transactionCategory = transactionCategory.toUpperCase();

      switch (transactionCategory) {
        case "A":
          this.transactionCategory = "Standard Price Paid";
          break;
        case "C":
          this.transactionCategory = "Additional Price Paid";
          break;
        default:
          this.transactionCategory = "Other";
      }
    } else this.transactionCategory = undefined;
  }

  /**
   * Getter for the record status
   * Indicates additions, changes and deletions to the records.(see guide below).
  A = Addition
  C = Change
  D = Delete
   * @return record status
   */
  getRecordStatus() {
    return this.recordStatus;
  }

  /**
  * Setter for the record status
  * Indicates additions, changes and deletions to the records.(see guide below).
  A = Addition
  C = Change
  D = Delete
  @param {string} record status
  */
  setRecordStatus(recordStatus) {
    if (recordStatus) {
      recordStatus = recordStatus.toUpperCase();

      switch (recordStatus) {
        case "A":
          this.recordStatus = "Addition";
          break;
        case "C":
          this.recordStatus = "Change";
          break;
        case "D":
          this.recordStatus = "Delete";
          break;
      }
    } else this.recordStatus = undefined;
  }
};
