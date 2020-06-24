const

  getHeaders = token => {
    return new Headers({
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    });
  },

  getData = async (url, token="", mode="cors") => {
    const response = await fetch(url, {method:"GET", mode, headers:getHeaders(token)});
    
    try {
      const result = await response.json();
      return result;
    } catch (ex) {
      console.error("Error", ex);
    }
  },

  postData = async (url, token="", data={}, mode="cors") => {
    const response = await fetch(url, {
      method: "POST",
      credentials: "same-origin",
      body: JSON.stringify(data),
      mode,
      headers: getHeaders(token)
    });

    try {
      return await response.json();
    } catch (ex) {
      throw new Error("POST - Error");
    }
  },

  putData = async (url, token="", data={}, mode="cors") => {
    const response = await fetch(url, {
      method: "PUT",
      credentials: "same-origin",
      body: JSON.stringify(data),
      mode,
      headers: getHeaders(token)
    });

    try {
      return await response.json();
    } catch (ex) {
      throw new Error("PUT - Error");
    }
  },

  deleteData = async (url, token="", mode="cors") => {
    const response = await fetch(url, {
      method: "DELETE",
      credentials: "same-origin",
      mode,
      headers: getHeaders(token)
    });

    try {
      return await response.json();
    } catch (ex) {
      throw new Error("DELETE - Error");
    }

  }
;
