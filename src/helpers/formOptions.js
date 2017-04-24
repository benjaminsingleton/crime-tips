const crimeTypeOptions = [
  {text: 'Arson', value: 'Arson'},
  {text: 'Assault', value: 'Assault'},
  {text: 'Bank Fraud', value: 'Bank Fraud'},
  {text: 'Burglary', value: 'Burglary'},
  {text: 'Drugs', value: 'Drugs'},
  {text: 'Fugitive', value: 'Fugitive'},
  {text: 'Guns', value: 'Guns'},
  {text: 'Homicide', value: 'Homicide'},
  {text: 'Human Trafficking', value: 'Human Trafficking'},
  {text: 'Robbery', value: 'Robbery'},
  {text: 'Sexual Assault', value: 'Sexual Assault'},
  {text: 'Shooting', value: 'Shooting'},
  {text: 'Terrorism', value: 'Terrorism'},
  {text: 'Theft', value: 'Theft'},
  {text: 'Vehicle Theft', value: 'Vehicle Theft'},
  {text: 'Other', value: 'Other'}
]

const tipsterAwareOfCrimeMethodOptions = [
  {text: 'I was a witness', value: 'I was a witness'},
  {text: 'It happened to me directly', value: 'It happened to me directly'},
  {text: 'Somebody told me about it', value: 'Somebody told me about it'},
  {text: 'I overheard a conversation', value: 'I overheard a conversation'},
  {text: 'I prefer not to answer', value: 'I prefer not to answer'},
  {text: 'Other', value: 'Other'},
]

const websiteDiscoveryMethodOptions = [
  {text: 'TV', value: 'TV'},
  {text: 'Google', value: 'Google'},
  {text: 'Facebook', value: 'Facebook'},
  {text: 'Twitter', value: 'Twitter'},
  {text: 'Radio', value: 'Radio'},
  {text: 'Newspaper', value: 'Newspaper'},
  {text: 'Word of Mouth', value: 'Word of Mouth'},
  {text: 'Sign / Billboard', value: 'Sign / Billboard'},
  {text: 'Other', value: 'Other'},
]

const vehicleMakeOptions = [
  {text: 'Acura', value: 'Acura'},
  {text: 'Audi', value: 'Audi'},
  {text: 'BMW', value: 'BMW'},
  {text: 'Buick', value: 'Buick'},
  {text: 'Cadillac', value: 'Cadillac'},
  {text: 'Chevrolet', value: 'Chevrolet'},
  {text: 'Chrysler', value: 'Chrysler'},
  {text: 'Dodge', value: 'Dodge'},
  {text: 'FIAT', value: 'FIAT'},
  {text: 'Ford', value: 'Ford'},
  {text: 'GMC', value: 'GMC'},
  {text: 'Honda', value: 'Honda'},
  {text: 'HUMMER', value: 'HUMMER'},
  {text: 'Hyundai', value: 'Hyundai'},
  {text: 'Infiniti', value: 'Infiniti'},
  {text: 'Isuzu', value: 'Isuzu'},
  {text: 'Jaguar', value: 'Jaguar'},
  {text: 'Jeep', value: 'Jeep'},
  {text: 'Kia', value: 'Kia'},
  {text: 'Land Rover', value: 'Land Rover'},
  {text: 'Lexus', value: 'Lexus'},
  {text: 'Lincoln', value: 'Lincoln'},
  {text: 'Mazda', value: 'Mazda'},
  {text: 'Mercedes-Benz', value: 'Mercedes-Benz'},
  {text: 'Mercury', value: 'Mercury'},
  {text: 'MINI', value: 'MINI'},
  {text: 'Mitsubishi', value: 'Mitsubishi'},
  {text: 'Nissan', value: 'Nissan'},
  {text: 'Oldsmobile', value: 'Oldsmobile'},
  {text: 'Plymouth', value: 'Plymouth'},
  {text: 'Pontiac', value: 'Pontiac'},
  {text: 'Porsche', value: 'Porsche'},
  {text: 'Ram', value: 'Ram'},
  {text: 'Saab', value: 'Saab'},
  {text: 'Saturn', value: 'Saturn'},
  {text: 'Scion', value: 'Scion'},
  {text: 'Smart', value: 'Smart'},
  {text: 'Subaru', value: 'Subaru'},
  {text: 'Suzuki', value: 'Suzuki'},
  {text: 'Tesla', value: 'Tesla'},
  {text: 'Toyota', value: 'Toyota'},
  {text: 'Volkswagen', value: 'Volkswagen'},
  {text: 'Volvo', value: 'Volvo'}
]

const vehicleColorOptions = [
  {text: 'White', value: 'White'},
  {text: 'Black', value: 'Black'},
  {text: 'Silver', value: 'Silver'},
  {text: 'Gray', value: 'Gray'},
  {text: 'Red', value: 'Red'},
  {text: 'Blue', value: 'Blue'},
  {text: 'Brown', value: 'Brown'},
  {text: 'Green', value: 'Green'},
  {text: 'Other', value: 'Other'}
]

const stateOptions = [
  {text: 'AK', value: 'AK'},
  {text: 'AL', value: 'AL'},
  {text: 'AR', value: 'AR'},
  {text: 'AZ', value: 'AZ'},
  {text: 'CA', value: 'CA'},
  {text: 'CO', value: 'CO'},
  {text: 'CT', value: 'CT'},
  {text: 'DC', value: 'DC'},
  {text: 'DE', value: 'DE'},
  {text: 'FL', value: 'FL'},
  {text: 'GA', value: 'GA'},
  {text: 'HI', value: 'HI'},
  {text: 'IA', value: 'IA'},
  {text: 'ID', value: 'ID'},
  {text: 'IL', value: 'IL'},
  {text: 'IN', value: 'IN'},
  {text: 'KS', value: 'KS'},
  {text: 'KY', value: 'KY'},
  {text: 'LA', value: 'LA'},
  {text: 'MA', value: 'MA'},
  {text: 'MD', value: 'MD'},
  {text: 'ME', value: 'ME'},
  {text: 'MI', value: 'MI'},
  {text: 'MN', value: 'MN'},
  {text: 'MO', value: 'MO'},
  {text: 'MS', value: 'MS'},
  {text: 'MT', value: 'MT'},
  {text: 'NC', value: 'NC'},
  {text: 'ND', value: 'ND'},
  {text: 'NE', value: 'NE'},
  {text: 'NH', value: 'NH'},
  {text: 'NJ', value: 'NJ'},
  {text: 'NM', value: 'NM'},
  {text: 'NV', value: 'NV'},
  {text: 'NY', value: 'NY'},
  {text: 'OH', value: 'OH'},
  {text: 'OK', value: 'OK'},
  {text: 'OR', value: 'OR'},
  {text: 'PA', value: 'PA'},
  {text: 'PR', value: 'PR'},
  {text: 'RI', value: 'RI'},
  {text: 'SC', value: 'SC'},
  {text: 'SD', value: 'SD'},
  {text: 'TN', value: 'TN'},
  {text: 'TX', value: 'TX'},
  {text: 'UT', value: 'UT'},
  {text: 'VA', value: 'VA'},
  {text: 'VT', value: 'VT'},
  {text: 'WA', value: 'WA'},
  {text: 'WI', value: 'WI'},
  {text: 'WV', value: 'WV'},
  {text: 'WY', value: 'WY'}, 
  {text: 'Unknown', value: 'Unk'}
]

const genderOptions = [
  {text: 'Male', value: 'Male'},
  {text: 'Female', value: 'Female'},
  {text: 'Trans*', value: 'Trans*'}
]

const raceOptions = [
  {text: 'White', value: 'White'},
  {text: 'Black', value: 'Black'},
  {text: 'White Hispanic', value: 'White Hispanic'},
  {text: 'Black Hispanic', value: 'Black Hispanic'},
  {text: 'Asian', value: 'Asian'},
  {text: 'American Indian /  Alaskan Native', value: 'American Indian /  Alaskan Native'},
  {text: 'Native Hawaiian / Pacific Islander', value: 'Native Hawaiian / Pacific Islander'}
]

const heightOptions = [
  {text: "4' 8''", value: "4' 8''"},
  {text: "4' 10''", value: "4' 10''"},
  {text: "5' 0''", value: "5' 0''"},
  {text: "5' 2''", value: "5' 2''"},
  {text: "5' 4''", value: "5' 4''"},
  {text: "5' 6''", value: "5' 6''"},
  {text: "5' 8''", value: "5' 8''"},
  {text: "5' 10''", value: "5' 10''"},
  {text: "6' 0''", value: "6' 0''"},
  {text: "6' 2''", value: "6' 2''"},
  {text: "6' 4''", value: "6' 4''"},
  {text: "6' 6''", value: "6' 6''"},
]

const hairColorOptions = [
  {text: 'Brown', value: 'Brown'},
  {text: 'Blonde', value: 'Blonde'},
  {text: 'Black', value: 'Black'},
  {text: 'White', value: 'White'},
  {text: 'Red', value: 'Red'},
  {text: 'Gray', value: 'Gray'},
  {text: 'Sandy', value: 'Sandy'},
  {text: 'Bald', value: 'Bald'},
]

const eyeColorOptions = [
  {text: 'Brown', value: 'Brown'},
  {text: 'Blue', value: 'Blue'},
  {text: 'Green', value: 'Green'},
  {text: 'Hazel', value: 'Hazel'},
  {text: 'Amber', value: 'Amber'},
]

const drugTypeOptions = [
  {text: 'Marijuana', value: 'Marijuana'},
  {text: 'Cocaine', value: 'Cocaine'},
  {text: 'Crack', value: 'Crack'},
  {text: 'Heroin', value: 'Heroin'},
  {text: 'Methamphetamine', value: 'Methamphetamine'},
  {text: 'Pills', value: 'Pills'},
  {text: 'Other', value: 'Other'}
]

const drugSaleMethodOptions = [
  {text: 'On the street', value: 'On the street'},
  {text: 'In an apartment / house', value: 'In an apartment / house'},
  {text: 'From a vehicle', value: 'From a vehicle'},
  {text: 'Other', value: 'Other'}
]

export {
  genderOptions,
  raceOptions,
  heightOptions,
  hairColorOptions,
  eyeColorOptions,
  crimeTypeOptions, 
  tipsterAwareOfCrimeMethodOptions,
  websiteDiscoveryMethodOptions,
  vehicleMakeOptions,
  vehicleColorOptions,
  stateOptions,
  drugTypeOptions,
  drugSaleMethodOptions
}