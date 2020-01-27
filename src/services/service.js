import jwtDecode from "jwt-decode";
import { apiUrl } from "../config.json";
import SwalAlert from "../services/SwalAlert";

const tokenKey = "token";
const urlEndPoint = apiUrl;

async function fetchData(requestBody) {
  const res = await fetch(urlEndPoint, {
    method: "POST",
    body: JSON.stringify(requestBody),
    headers: {
      "Content-Type": "application/json",
      Authorization: localStorage.getItem(tokenKey)
    }
  });
  console.log("res di service", res);
  if (res.status >= 400 && res.status < 500) {
    return SwalAlert.warning(`${res.status} ${res.statusText}`, "error");
  }
  return res.json();
}
// TUJUAN: MAU SERACH USER DI SERACPESON COMPONENT
export function getUser(propsUsername) {
  const username = JSON.stringify(propsUsername).toLowerCase();
  const requestBody = {
    query: `
        query{
          s1:searchUsername(input:{username:${username}}) {
            id
            username
            email
          }
          s2:searchUsername(input:{username:"[${propsUsername}]"}) {
            id
            username
            email
          }
        }
      `
  };

  return fetchData(requestBody);
}

// Later, I'll only using user.id as parameter.
export function getPosts(propsUsername, lastId) {
  const username = JSON.stringify(propsUsername).toLowerCase();
  const cursor = lastId ? lastId : null;
  const requestBody = {
    query: `
        query{
          getUser(input:{username:${username}}) {
            id
            username
            email
            somePosts (limit:10, cursor: ${cursor}) {
              id
              post
              createdAt
              likes {
                id
                like
                postId
                creatorLikesId
              }
              comments {
                id
                postId
                comment
                creatorComment {
                  id
                  username
                }
              }
              creatorPost {
                username
                id
              }
            }
          }
        }
      `
  };

  return fetchData(requestBody);
}
export function getAllPosts(lastId) {
  // const username = JSON.stringify(propsUsername).toLowerCase();
  const cursor = lastId ? lastId : null;
  const requestBody = {
    query: `
        query{
          getSelectedPost(input:{limit:10, cursor: ${cursor}}) {
            id
            post
            createdAt
            likes {
              id
              like
              postId
              creatorLikesId
            }
            comments {
              id
              postId
              comment
              creatorComment {
                id
                username
              }
            }
            creatorPost {
              username
              id
            }
          }
        }
      `
  };

  return fetchData(requestBody);
}

// getCommentsLikes, using later
// export function getCommentsLikes(propsUsername, lastId) {
//   const username = JSON.stringify(propsUsername).toLowerCase();
//   const cursor = lastId ? lastId : null;
//   const requestBody = {
//     query: `
//         query{
//           getUser(input:{username:${username}}) {
//             somePosts (limit:10, cursor:${cursor}) {
//               likes {
//                 id
//                 like
//                 postId
//                 creatorLikesId
//               }
//               comments {
//                 id
//                 postId
//                 comment
//                 creatorComment {
//                   id
//                   username
//                 }
//               }
//             }
//           }
//         }
//       `
//   };

//   return fetchData(requestBody);
// }

export function createPost(propsUserId, message) {
  const requestBody = {
    query: `
      mutation{
        createPost(input:{creatorPostId:${propsUserId}, post:
"""
${message}
"""}) {
          id
          post
          createdAt
          creatorPost {
            username
            id
          }
          likes {
            id
            like
            postId
            creatorLikesId
          }
        }
      }
    `
  };

  return fetchData(requestBody);
}

export function createComment(propsUserId, postId, message) {
  const requestBody = {
    query: `
      mutation{
        createComment(input:{creatorCommentId:${propsUserId},postId:${postId}, comment:
"""
${message}
"""}) {
          id
          comment
          postId
          creatorComment {
            id
            username
          }
        }
      }
    `
  };

  return fetchData(requestBody);
}

export function updateOrCreateLike(propsUserId, postId, like) {
  const requestBody = {
    query: `
      mutation {
        updateOrCreateLike(input: 
        { like: ${like}, postId: ${postId}, creatorLikesId: ${propsUserId} }) {
          id
          like
          postId
          creatorLikesId
        }
      }
    `
  };

  return fetchData(requestBody);
}

export function deletePost(id) {
  const requestBody = {
    query: `
        mutation{
          deletePost(input:{id:${id}})
        }
      `
  };

  return fetchData(requestBody);
}

export function deleteComment(id) {
  const requestBody = {
    query: `
        mutation{
          deleteComment(input:{id:${id}})
        }
      `
  };

  return fetchData(requestBody);
}

export function getCurrentUser() {
  try {
    const jwt = localStorage.getItem(tokenKey);
    console.log(jwtDecode(jwt));
    return jwtDecode(jwt);
  } catch (ex) {
    return null;
  }
}

export function logout() {
  localStorage.removeItem(tokenKey);
}

export default {
  deletePost,
  createPost,
  createComment,
  getUser,
  getPosts,
  getAllPosts,
  // getCommentsLikes,
  getCurrentUser,
  logout
  // login,
};
