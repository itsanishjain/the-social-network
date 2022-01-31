// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <0.9.0;
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/access/Ownable.sol";

contract SocialNetwork is Ownable {
    uint256 public POST_ID = 0; // Primary key
    address ADMIN = msg.sender;

    // Job datatype
    struct Post {
        uint256 postId;
        address user;
        string imageUrl;
    }

    Post[] public posts;

    // add a post
    // default parameter is not there in Solidity
    function addPost(string memory _imageUrl) public {
        Post memory post = Post({
            postId: POST_ID,
            user: msg.sender,
            imageUrl: _imageUrl
        });
        posts.push(post);
        POST_ID++;
    }

    // return all posts
    function allPosts() public view returns(Post[] memory) {
        return posts;
    }
   
    // return this
    function admin() public view returns(address) {
        return ADMIN;
    }


}
