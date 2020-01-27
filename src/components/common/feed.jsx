import React from "react";
import { Link } from "react-router-dom";
import BottomScrollListener from "react-bottom-scroll-listener";
import TextareaAutosize from "react-textarea-autosize";
import _ from "lodash";

const Feed = ({
  disableLoad,
  posts,
  comments,
  likes,
  user,
  handleCreateComment,
  handleOnClickCommentButton,
  handleGetPosts,
  handleDeletePost,
  handleDeleteComment,
  handleUpdateOrCreateLike,
  handleResetFeed
}) => {
  const isLike = likes.filter(item => item.like === true);
  const countLikes = _.countBy(isLike, "postId");
  const countComment = _.countBy(comments, "postId");

  return (
    <React.Fragment>
      <table className="w-100">
        {posts.map(post => (
          <tbody key={post.id} className="card-body card mb-2 p-2 ml-0 mr-0">
            <tr className="d-flex align-items-center">
              <td className="border-0 d-flex flex-column mr-2">
                <Link
                  onClick={handleResetFeed}
                  className="post-photo"
                  to={{
                    pathname: `/profile/${post.creatorPost.username}`,
                    state: post.creatorPost.username
                  }}
                >
                  <img
                    className="post-photo"
                    src={`https://i.picsum.photos/id/${post.creatorPost.id}/300/300.jpg`}
                    alt="Profile"
                  />
                </Link>
              </td>
              <td className="d-flex flex-column border-0">
                <Link
                  onClick={handleResetFeed}
                  className="post-name"
                  to={{
                    pathname: `/profile/${post.creatorPost.username}`,
                    state: post.creatorPost.username
                  }}
                >
                  {post.creatorPost.username}
                </Link>
                <span className="post-time">
                  {`${new Date(
                    Number(post.createdAt)
                  ).toLocaleTimeString()} ${new Date(
                    Number(post.createdAt)
                  ).toDateString()}`}
                </span>
              </td>
              {post.creatorPost.username === user.username && (
                <td className="ml-auto ellipsis">
                  <div>
                    <i
                      className="fa fa-ellipsis-h"
                      data-toggle="dropdown"
                      aria-haspopup="true"
                      aria-expanded="false"
                    ></i>
                    <div className="dropdown-menu dropdown-menu-right">
                      <li className="dropdown-item">Edit</li>
                      <li
                        className="dropdown-item"
                        onClick={() => handleDeletePost(post)}
                      >
                        Delete
                      </li>
                    </div>
                  </div>
                </td>
              )}
            </tr>
            <tr className="mt-2 mb-2">
              <td className="mt-20 mb-20 post-message border-0">{post.post}</td>
            </tr>

            <tr className="d-flex border-bottom border-top mb-1">
              <td className="w-100">
                <button
                  name={post.id}
                  type="button"
                  className="btn btn-light shadow-none rounded-0 p-0 float-left w-50"
                  onClick={() => handleOnClickCommentButton(post)}
                >
                  <i className="material-icons-outlined">comment</i>
                </button>
                <button
                  type="button"
                  className="btn btn-light shadow-none rounded-0 p-0 float-right w-50"
                  onClick={() => handleUpdateOrCreateLike(post)}
                >
                  {post.iconLikes === true && (
                    <i className="material-icons">thumb_up</i>
                  )}
                  {post.iconLikes === false && (
                    <i className="material-icons-outlined">thumb_up</i>
                  )}
                </button>
              </td>
            </tr>
            <tr>
              <td>
                {countComment[post.id] > 0 && (
                  <small>{countComment[post.id]} comment</small>
                )}
              </td>
              <td>
                {countLikes[post.id] > 0 && (
                  <small>{countLikes[post.id]} like</small>
                )}
              </td>
            </tr>
            {post.commentsRow === true && (
              <React.Fragment>
                {comments.map(comment => (
                  <tr
                    className="d-flex align-items-center"
                    id={`comment${post.id}`}
                    key={comment.id}
                  >
                    {comment.postId === post.id && (
                      <React.Fragment>
                        <td className="border-0 d-flex flex-column mb-2 align-self-start">
                          <Link
                            onClick={handleResetFeed}
                            to={{
                              pathname: `/profile/${comment.creatorComment.username}`,
                              state: comment.creatorComment.username
                            }}
                          >
                            <img
                              className="comment-photo mr-2"
                              src={`https://i.picsum.photos/id/${comment.creatorComment.id}/300/300.jpg`}
                              alt="Profile"
                            />
                          </Link>
                        </td>
                        <td className="comment-message border-0 mb-2 pb-1 pt-1 pr-2 pl-2">
                          <Link
                            onClick={handleResetFeed}
                            to={{
                              pathname: `/profile/${comment.creatorComment.username}`,
                              state: comment.creatorComment.username
                            }}
                          >
                            <strong>{comment.creatorComment.username}</strong>
                          </Link>{" "}
                          {comment.comment}
                        </td>
                        {comment.creatorComment.username === user.username && (
                          <td className="d-flex flex-column align-self-center pl-1">
                            <div>
                              <i
                                className="fa fa-ellipsis-h ellipsis"
                                data-toggle="dropdown"
                                aria-haspopup="true"
                                aria-expanded="false"
                              ></i>
                              <div className="dropdown-menu dropdown-menu-right">
                                <li className="dropdown-item">Edit</li>
                                <li
                                  className="dropdown-item"
                                  onClick={() => handleDeleteComment(comment)}
                                >
                                  Delete
                                </li>
                              </div>
                            </div>
                          </td>
                        )}
                      </React.Fragment>
                    )}
                  </tr>
                ))}

                <tr className="d-flex align-items-center">
                  <td className="border-0 d-flex align-self-start">
                    <Link
                      onClick={handleResetFeed}
                      to={{
                        pathname: `/profile/${user.username}`,
                        state: user.username
                      }}
                    >
                      <img
                        className="comment-photo mr-2"
                        src={`https://i.picsum.photos/id/${user.id}/300/300.jpg`}
                        alt="Profile"
                      />
                    </Link>
                  </td>
                  <td className="w-100">
                    <form>
                      <TextareaAutosize
                        type="text"
                        className="comment-message comment-form pr-2 pl-2 pt-1 pb-1 form-control"
                        id={`comment${post.id}`}
                        placeholder="Write Comment"
                        name={post.id}
                        autoComplete="off"
                        maxRows={20}
                        onKeyDown={e => handleCreateComment(e, post.id)}
                      />
                    </form>
                  </td>
                </tr>
              </React.Fragment>
            )}
          </tbody>
        ))}
      </table>
      {disableLoad === false && (
        <BottomScrollListener onBottom={handleGetPosts} offset={200} />
      )}
    </React.Fragment>
  );
};

export default Feed;
