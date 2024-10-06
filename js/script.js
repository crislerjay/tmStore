$(function() {
  let items;

  // read CSV
  $.ajax({
    type: "GET",
    url: "/tmStore/data/db.csv",
    dataType: "text",
    beforeSend: function(xhr){
        xhr.overrideMimeType("text/html;charset=Shift_JIS");
    },
    error: function (jqXHR) {
      console.log("Uncaught Error : " + jqXHR.status + " " + jqXHR.statusText);
    },
    success: function(result) {
      // converted as object
      var ctr_data = $.csv.toObjects(result);
      // sort data
      // Initial display of all items
      displayItems(ctr_data);
      items = ctr_data
    }
  });

  // Function to display items
  function displayItems(filteredItems) {
    filteredItems.sort((a, b) => {
      if (a.item < b.item) return -1;
      if (a.item > b.item) return 1;
      return 0;
    });
    const itemList = $('#itemList');
    itemList.empty();
    filteredItems.forEach(item => {
      itemList.append(`
        <li class="item">
          <div>
            <h3>${item.item}</h3>
            <p><strong>Category:</strong> ${item.category}</p>
          </div>
          <div>
            <p><strong>Price:</strong> ${item.price}</p>
            <p><strong>Price Per Piece:</strong> ${item.pricePerPiece || 'N/A'}</p>
          </div>
        </li>
      `);
    });
  }

  // Search functionality
  $('#searchInput').on('input', function() {
    const searchTerm = $(this).val().toLowerCase();
    const filteredItems = items.filter(item => 
      item.item.toLowerCase().includes(searchTerm)
    );
    displayItems(filteredItems);
  });

  // Filter by category
  $('#categoryFilter').on('change', function() {
    const selectedCategory = $(this).val();
    const filteredItems = items.filter(item => 
      !selectedCategory || item.category === selectedCategory
    );
    displayItems(filteredItems);
  });
});
