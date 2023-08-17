const DataAPIPrompt = async () => {
  try {
    let data = await fetch(
      "https://sheets.googleapis.com/v4/spreadsheets/1KY4XpbmJabeUMZDq6jBCR2o6N0F_vRvJvGTzZloaiUs/values/RainbowsPrompt?valueRenderOption=FORMATTED_VALUE&key=AIzaSyCviS0k-eDqXAz7IY-HbKWNkyPhGRbBlSI"
    );
    let { values } = await data.json();
    let [, ...Data] = values.map((data) => data);
    return Data;
  } catch {
    console.log("Error Fetching Data From SpreadSheet");
  }
};
export default DataAPIPrompt;

