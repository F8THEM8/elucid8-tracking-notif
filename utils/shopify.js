const fetchOrderData = async (orderNumber, email) => {
  const query = `
    {
      orders(first: 1, query: "name:${orderNumber} email:${email}") {
        edges {
          node {
            id
            name
            email
            fulfillmentStatus
            trackingCompany
            trackingNumbers
          }
        }
      }
    }
  `;
  
  try {
    const response = await fetch(`https://${process.env.SHOPIFY_SHOP_NAME}/admin/api/2024-04/graphql.json`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Access-Token": process.env.SHOPIFY_ACCESS_TOKEN,
      },
      body: JSON.stringify({ query }),
    });
    
    const data = await response.json();
    console.log("Shopify API Response:", data);  // Enhanced logging here
    
    if (data.errors) {
      console.error("Shopify API Errors:", data.errors);
      throw new Error(`Shopify API Error: ${JSON.stringify(data.errors)}`);
    }

    const orders = data.data.orders.edges;
    if (orders.length === 0) {
      console.log("No orders found for the provided details");
      return null;
    }

    const order = orders[0].node;
    return {
      orderName: order.name,
      email: order.email,
      fulfillmentStatus: order.fulfillmentStatus,
      trackingNumber: order.trackingNumbers[0] || "N/A", // Handle case where no tracking number is available
    };
  } catch (error) {
    console.error("Error fetching Shopify order:", error);
    return null;
  }
};
