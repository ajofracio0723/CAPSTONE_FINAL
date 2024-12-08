// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract ProductRegistry {
    struct Product {
        string productName;
        string description;
        string brand;
        string uniqueIdentifier;
        address owner;
        uint256 timestamp;
    }

    // Mapping to store products by unique identifier
    mapping(string => Product) public products;

    // Admin address to restrict some operations to the owner
    address public admin;

    // Event for logging product registration
    event ProductRegistered(
        string indexed uniqueIdentifier,
        string productName,
        string brand,
        address owner,
        uint256 timestamp,
        uint256 amountPaid
    );

    // Modifier to allow only the admin to call certain functions
    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can perform this action");
        _;
    }

    // Constructor that sets the initial admin address
    constructor() {
        admin = msg.sender;
    }

    // Function to add a product to the blockchain and accept payment
    function addProduct(
        string memory _productName,
        string memory _description,
        string memory _brand,
        string memory _uniqueIdentifier
    ) public payable {
        // Ensure a unique identifier is provided and the product doesn't already exist
        require(bytes(_uniqueIdentifier).length > 0, "Unique identifier is required");
        require(products[_uniqueIdentifier].owner == address(0), "Product already exists");

        // Ensure payment is sent
        require(msg.value > 0, "Payment required to add a product");

        // Create a new Product struct
        Product memory newProduct = Product({
            productName: _productName,
            description: _description,
            brand: _brand,
            uniqueIdentifier: _uniqueIdentifier,
            owner: msg.sender,
            timestamp: block.timestamp
        });

        // Store the new product in the mapping
        products[_uniqueIdentifier] = newProduct;

        // Emit event to log the product registration with payment amount
        emit ProductRegistered(_uniqueIdentifier, _productName, _brand, msg.sender, block.timestamp, msg.value);
    }

    // Function to get product details by unique identifier
    function getProduct(string memory _uniqueIdentifier) public view returns (
        string memory, string memory, string memory, string memory, address, uint256
    ) {
        // Ensure the product exists
        require(products[_uniqueIdentifier].owner != address(0), "Product not found");

        // Retrieve the product from storage
        Product memory product = products[_uniqueIdentifier];

        // Return product details
        return (
            product.productName,
            product.description,
            product.brand,
            product.uniqueIdentifier,
            product.owner,
            product.timestamp
        );
    }

    // Function to update product details (optional, only admin can update)
    function updateProduct(
        string memory _productName,
        string memory _description,
        string memory _brand,
        string memory _uniqueIdentifier
    ) public onlyAdmin {
        // Ensure the product exists
        require(products[_uniqueIdentifier].owner != address(0), "Product not found");

        // Update the product details
        Product storage product = products[_uniqueIdentifier];
        product.productName = _productName;
        product.description = _description;
        product.brand = _brand;

        // Emit event to log the product update
        emit ProductRegistered(_uniqueIdentifier, _productName, _brand, product.owner, block.timestamp, 0);
    }

    // Fallback function to accept Ether
    receive() external payable {}

    // Function to withdraw Ether (only admin can call this)
    function withdraw(uint256 _amount) public onlyAdmin {
        require(address(this).balance >= _amount, "Insufficient balance");
        payable(admin).transfer(_amount);
    }

    // Function to check contract balance
    function getContractBalance() public view returns (uint256) {
        return address(this).balance;
    }
}
