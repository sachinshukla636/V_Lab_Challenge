class AnimalTable {
  constructor(data, tableId, sortOptions) {
    this.data = data;
    this.tableId = tableId;
    this.sortOptions = sortOptions;
    this.renderTable();
  }

  // Render the table dynamically
  renderTable() {
    const table = document.getElementById(this.tableId);
    table.innerHTML = `
      <thead>
        <tr>
          <th>Species</th>
          <th ${
            this.sortOptions.includes("name")
              ? `onclick="tables['${this.tableId}'].sortTable('name')"`
              : ""
          }>Name</th>
          <th>Image</th>
          <th ${
            this.sortOptions.includes("size")
              ? `onclick="tables['${this.tableId}'].sortTable('size')"`
              : ""
          }>Size</th>
          <th ${
            this.sortOptions.includes("location")
              ? `onclick="tables['${this.tableId}'].sortTable('location')"`
              : ""
          }>Location</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        ${this.data
          .map(
            (animal) => `
          <tr>
            <td>${animal.species}</td>
            <td class="${this.getNameClass()}">${animal.name}</td>
            <td>
              <img src="${animal.image}" alt="${
              animal.name
            }" class="animal-image" />
            </td>
            <td>${animal.size}</td>
            <td>${animal.location}</td>
            <td>
              <button class="btn btn-sm btn-warning" onclick="tables['${
                this.tableId
              }'].editAnimal('${animal.name}')">Edit</button>
              <button class="btn btn-sm btn-danger" onclick="tables['${
                this.tableId
              }'].deleteAnimal('${animal.name}')">Delete</button>
            </td>
          </tr>
        `
          )
          .join("")}
      </tbody>
      <tfoot>
        <tr>
          <td colspan="6">
            <button class="btn btn-sm btn-success" onclick="tables['${
              this.tableId
            }'].showAddAnimalForm()">Add Animal</button>
          </td>
        </tr>
      </tfoot>
    `;
  }

  // Get table-specific name styling
  getNameClass() {
    if (this.tableId === "dogsTable") return "bold-text";
    if (this.tableId === "bigFishTable") return "bold-italic-blue";
    return "";
  }

  // Add a new animal with validation
  addAnimal(animal) {
    if (this.data.some((a) => a.name === animal.name)) {
      alert("Duplicate entry is not allowed!");
      return;
    }
    this.data.push(animal);
    this.renderTable();
  }

  // Show the form to add an animal
  showAddAnimalForm() {
    const species = prompt("Enter species:");
    const name = prompt("Enter name:");
    const size = prompt("Enter size (e.g., 10 ft):");
    const location = prompt("Enter location:");
    const image =
      prompt("Enter image URL (leave empty for default):") ||
      "images/alabai.png";

    if (!species || !name || !size || !location) {
      alert("All fields are required!");
      return;
    }

    const newAnimal = { species, name, size, location, image };
    this.addAnimal(newAnimal);
  }

  // Edit an existing animal
  editAnimal(name) {
    const animal = this.data.find((a) => a.name === name);
    if (!animal) return;

    const newName = prompt("Enter new name:", animal.name) || animal.name;
    const newSize = prompt("Enter new size:", animal.size) || animal.size;
    const newLocation =
      prompt("Enter new location:", animal.location) || animal.location;
    const newImage =
      prompt("Enter new image URL:", animal.image) || animal.image;

    animal.name = newName;
    animal.size = newSize;
    animal.location = newLocation;
    animal.image = newImage;

    this.renderTable();
  }

  // Delete an animal
  deleteAnimal(name) {
    this.data = this.data.filter((animal) => animal.name !== name);
    this.renderTable();
  }

  // Sort the table by a specific field
  sortTable(field) {
    this.data.sort((a, b) => {
      if (field === "size") {
        // Sort sizes numerically
        return parseFloat(a.size) - parseFloat(b.size);
      }
      return a[field].localeCompare(b[field]);
    });
    this.renderTable();
  }
}

// Fetch JSON data from files
async function fetchData(file) {
  try {
    const response = await fetch(file);
    return await response.json();
  } catch (error) {
    console.error("Error fetching data:", error);
    return [];
  }
}

// Initialize tables after fetching data
async function initializeTables() {
  const bigCats = await fetchData("bigCats.json");
  const dogs = await fetchData("dogs.json");
  const bigFish = await fetchData("bigFish.json");

  // Initialize tables
  tables["bigCatsTable"] = new AnimalTable(bigCats, "bigCatsTable", [
    "name",
    "size",
    "location",
  ]);
  tables["dogsTable"] = new AnimalTable(dogs, "dogsTable", [
    "name",
    "location",
  ]);
  tables["bigFishTable"] = new AnimalTable(bigFish, "bigFishTable", ["size"]);
}

// Object to store table instances
const tables = {};

// Start the initialization
initializeTables();
