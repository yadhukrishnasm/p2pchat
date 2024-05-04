async function analyzeMessage(message) {
    try {
      const apiKey = "AIzaSyAnN5QzylZIyNyUTJk1UcbrHdJGjTCFO2o" ; 
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`;
  
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body : JSON.stringify({
            contents: [{
              parts: [{
                text: message
              }]
            }]
          })
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error status: ${response.status}`);
      }
  
      const data = await response.json();
      console.log(data)
      return data;
    } catch (error) {
      console.error('Error analyzing message:', error);
      throw error;
    }
  }
  export default analyzeMessage;