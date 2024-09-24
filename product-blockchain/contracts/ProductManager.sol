// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract ProductRegistry {
    struct Product {
        string productName;
        string description;
        string uniqueIdentifier;
        uint256 timestamp;
        address addedBy;
    }

    mapping(string => Product) private products;
    string[] private productIds;

    event ProductAdded(string indexed uniqueIdentifier, string productName, address indexed addedBy);

    function addProduct(string memory _productName, string memory _description, string memory _uniqueIdentifier) public {
        require(bytes(_productName).length > 0, "Product name cannot be empty");
        require(bytes(_description).length > 0, "Description cannot be empty");
        require(bytes(_uniqueIdentifier).length > 0, "Unique identifier cannot be empty");
        require(bytes(products[_uniqueIdentifier].uniqueIdentifier).length == 0, "Product already exists");
        
        products[_uniqueIdentifier] = Product(_productName, _description, _uniqueIdentifier, block.timestamp, msg.sender);
        productIds.push(_uniqueIdentifier);
        
        emit ProductAdded(_uniqueIdentifier, _productName, msg.sender);
    }

    function getProduct(string memory _uniqueIdentifier) public view returns (string memory, string memory, string memory, uint256, address) {
        Product memory product = products[_uniqueIdentifier];
        require(bytes(product.uniqueIdentifier).length > 0, "Product not found");
        
        return (product.productName, product.description, product.uniqueIdentifier, product.timestamp, product.addedBy);
    }

    function getProductCount() public view returns (uint256) {
        return productIds.length;
    }

    function getProductIdByIndex(uint256 _index) public view returns (string memory) {
        require(_index < productIds.length, "Index out of bounds");
        return productIds[_index];
    }

    function getProductsByPage(uint256 _page, uint256 _perPage) public view returns (Product[] memory) {
        require(_perPage > 0, "Items per page must be greater than 0");
        uint256 startIndex = _page * _perPage;
        require(startIndex < productIds.length, "Page out of bounds");

        uint256 endIndex = startIndex + _perPage;
        if (endIndex > productIds.length) {
            endIndex = productIds.length;
        }

        Product[] memory pageProducts = new Product[](endIndex - startIndex);
        for (uint256 i = startIndex; i < endIndex; i++) {
            pageProducts[i - startIndex] = products[productIds[i]];
        }

        return pageProducts;
    }
}