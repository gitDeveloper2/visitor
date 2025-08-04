export const generateTimestamp = () => {
    return String(Date.now() * 1e6);
  };
  
  export const getNaturalDate=(date:Date)=>date.toLocaleDateString('en-GB',{
      day:'numeric',
      month:"long",
      year:"numeric"
    })