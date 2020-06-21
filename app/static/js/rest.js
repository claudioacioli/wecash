const

  getHeaders = () => {
    return new Header({
      "Content-Type": "application/json"
    });
  },

  getData = async (url, mode="cors") => {
    const response = await fetch(url, {method:"GET", mode});
    
    try {
      const result = await response.json();
      return result;
    } catch (ex) {
      console.error("Error", ex);
    }
  },

  postData = async (url, data={}, mode="cors") => {
    const response = await fetch(url, {
      method: "POST",
      credentials: "same-origin",
      body: JSON.stringify(data),
      mode,
      headers: getHeaders()
    });

    try {
      return await response.json();
    } catch (ex) {
      throw new Error("POST - Error");
    }
  },

  putData = async (url, data={}, mode="cors") => {
    const response = await fetch(url, {
      method: "POST",
      credentials: "same-origin",
      body: JSON.stringify(data),
      mode,
      headers: getHeaders()
    });

    try {
      return await response.json();
    } catch (ex) {
      throw new Error("PUT - Error");
    }
  },

  deleteData = async (url, mode="cors") => {
    const response = await fetch(url, {
      method: "DELETE",
      credentials: "same-origin",
      mode,
      headers: getHeaders()
    });

    try {
      return await response.json();
    } catch (ex) {
      throw new Error("DELETE - Error");
    }

  }
;
