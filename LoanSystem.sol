// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract LoanSystem {
    struct Scheme {
        string schemeName;
        uint256 schemeAmount;
        uint256 expiryDate;
        string description;
        bool isActive;
    }

    struct Farmer {
        uint256 farmerID;
        string name;
        string email;
        bool isRegistered;
    }

    mapping(uint256 => Scheme) public schemes;
    mapping(uint256 => Farmer) public farmers;
    mapping(uint256 => uint256) public applications; // Farmer ID -> Scheme ID
    mapping(uint256 => bool) public loanApproved; // Farmer ID -> Approval Status

    uint256 public schemeCount;
    uint256 public farmerCount;

    event SchemeInitiated(uint256 schemeID, string schemeName, uint256 schemeAmount);
    event SchemeApplied(uint256 farmerID, uint256 schemeID);
    event LoanApproved(uint256 farmerID, uint256 schemeID);
    event LoanDenied(uint256 farmerID, string reason);
    event LoanAcknowledged(uint256 farmerID, uint256 loanID);

    function initiateScheme(string memory _schemeName, uint256 _schemeAmount, uint256 _expiryDate, string memory _description) public {
        schemeCount++;
        schemes[schemeCount] = Scheme(_schemeName, _schemeAmount, _expiryDate, _description, true);
        emit SchemeInitiated(schemeCount, _schemeName, _schemeAmount);
    }

    function registerFarmer(uint256 _farmerID, string memory _name, string memory _email) public {
        require(!farmers[_farmerID].isRegistered, "Farmer already registered");
        farmers[_farmerID] = Farmer(_farmerID, _name, _email, true);
        farmerCount++;
    }

    function applyForScheme(uint256 _farmerID, uint256 _schemeID) public {
        require(schemes[_schemeID].isActive, "Scheme is not active");
        applications[_farmerID] = _schemeID;
        emit SchemeApplied(_farmerID, _schemeID);
    }

    function approveRequest(uint256 _farmerID) public {
        loanApproved[_farmerID] = true;
        emit LoanApproved(_farmerID, applications[_farmerID]);
    }

    function denyRequest(uint256 _farmerID, string memory _reason) public {
        loanApproved[_farmerID] = false;
        emit LoanDenied(_farmerID, _reason);
    }

    function acknowledgeLoan(uint256 _farmerID, uint256 _loanID) public {
        require(loanApproved[_farmerID], "Loan not approved");
        emit LoanAcknowledged(_farmerID, _loanID);
    }
}
