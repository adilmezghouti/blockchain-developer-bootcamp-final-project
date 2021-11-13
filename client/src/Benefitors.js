

const Benefitors= ({benefitors}) => {
  console.log('benefitors: ', benefitors)
  return <div>
    {Object.keys(benefitors)
      .filter(key => key.startsWith('benefitor') )
      .map(key => <div key={key}>{key} : {benefitors[key]}</div>)}
  </div>
}

export default Benefitors;