import React, { Component } from "react";
import _ from "lodash";
import Feed from "./common/feed";
import PostInput from "./common/postInput";
import ProfileNotFound from "./common/profileNotFound";
import ProfileJumbotron from "./common/profileJumbotron";
import {
  getPosts,
  createPost,
  createComment,
  deletePost,
  deleteComment,
  updateOrCreateLike
} from "../services/service";

class Profile extends Component {
  constructor(props) {
    super(props);
    this.createPostInput = "";
    this.createCommentInput = "";
    this.state = {
      profile: [],
      posts: [],
      comments: [],
      likes: [],
      showCreatePost: false,
      reset: false,
      disablePostButton: true,
      lastId: null
    };
  }

  componentDidMount() {
    // console.log("call componentDidMount");
    // console.log("this.state.lastId", this.state.lastId);
    if (!this.props.match.params.username) {
      if (this.props.user)
        return (window.location = `/profile/${this.props.user.user.username}`);
      return (window.location = "/login");
    }
    this.showCreatePost();
    this.handleGetPosts();
    window.scrollTo(0, 0);
  }

  componentDidUpdate(prevProps, prevState) {
    // console.log("call componentDidUpdate");
    // console.log("this.state.lastId", this.state.lastId);
    // re-fetching data in current page with different user (not full reload)
    if (prevProps.match.params.username !== this.props.match.params.username) {
      // console.log("call componentDidUpdate different user");
      // console.log(
      //   "prevProps.match.params.username",
      //   prevProps.match.params.username
      // );
      // console.log(
      //   "this.props.match.params.username",
      //   this.props.match.params.username
      // );
      this.setState({
        lastId: null,
        profile: [],
        posts: [],
        comments: [],
        likes: [],
        changeUser: true
      });
      this.showCreatePost();
      this.getposts(null);
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    // console.log("call componentWillReceiveProps");
    // console.log("this.state.lastId", this.state.lastId);
    // re-fetching data in current page with same user (not full reload)
    if (nextProps.location.state === this.props.match.params.username) {
      // console.log("call componentWillReceiveProps same User");
      this.setState({
        lastId: null,
        profile: [],
        posts: [],
        comments: [],
        likes: []
      });
      this.showCreatePost();
      this.getposts(null);
      // return this.componentDidMount();
    }
  }

  // shouldComponentUpdate(nextProps, nextState) {
  //   console.log("call shouldComponentUpdate");
  //   console.log("nextState di SCU:", nextState);
  //   console.log("this.state di SCU:", this.state);
  //   console.log("nextProps.location di SCU:", nextProps);
  //   console.log("this.props.location di SCU:", this.props);
  //   return nextProps === this.props;
  // }

  handleGetPosts = () => {
    // console.log("call handleGetPosts");
    // console.log("this.state.lastId", this.state.lastId);
    let lastId = this.state.lastId;
    const differentUser =
      this.state.usernameThisProfile !== this.props.match.params.username;
    // console.log(this.state.usernameThisProfile, this.state.usernameThisProfile);
    if (differentUser) {
      lastId = null;
    }
    // console.log("this.state.lastId bawah", this.state.lastId);
    this.getposts(this.state.lastId);
  };

  handleResetFeed = () => {
    this.setState({
      lastId: null,
      profile: [],
      posts: [],
      comments: [],
      likes: []
    });
  };

  handleOnClickCommentButton = post => {
    // this.setState({ comment });
    const posts = [...this.state.posts];
    const indexPost = posts.indexOf(post);
    posts[indexPost].commentsRow = !posts[indexPost].commentsRow;
    this.setState({ posts });
  };

  showCreatePost = () => {
    if (!this.props.user) return this.setState({ showCreatePost: false });
    this.props.user.user.username === this.props.match.params.username
      ? this.setState({ showCreatePost: true })
      : this.setState({ showCreatePost: false });
  };

  // handleGetCommentsLikes using later
  // handleGetCommentsLikes = () => {
  //   getCommentsLikes(this.props.match.params.username, this.state.lastId).then(
  //     data => {
  //       console.log("data:", data);
  //       try {
  //         const comments = data.data.getUser.somePosts;
  //         const likes = data.data.getUser.somePosts;
  //         const bankComment = [];
  //         const bankLike = [];

  //         comments.map(c => c.comments.map(item => bankComment.push(item)));
  //         likes.map(l => l.likes.map(item => bankLike.push(item)));

  //         this.setState({ comments: bankComment });
  //         this.setState({ likes: bankLike });
  //       } catch (error) {
  //         return this.setState({ NotFound: true });
  //       }
  //     }
  //   );
  // };

  handleDeletePost = post => {
    // Using Pesimis
    deletePost(post.id).then(data => {
      try {
        if (data.data) {
          const posts = this.state.posts.filter(p => p.id !== post.id);
          this.setState({ posts });
        }
      } catch (error) {
        throw new Error("data not found");
      }
    });
  };

  handleDeleteComment = comment => {
    // Using Pesimis
    deleteComment(comment.id).then(data => {
      try {
        if (data.data) {
          const comments = this.state.comments.filter(c => c !== comment);
          this.setState({ comments });
        }
      } catch (error) {
        throw new Error("data not found");
      }
    });
  };

  //
  handleCreateComment = (e, postId) => {
    const limit = 1500;
    if (e.currentTarget.value.length > limit) {
      e.currentTarget.value = this.createCommentInput;
      return;
    }
    const input = e.currentTarget.value;
    this.createCommentInput = input;
    // Using Pesimis
    if (e.keyCode === 13 && e.shiftKey === false && input.length <= limit) {
      e.preventDefault();
      const messageInput = e.currentTarget.value;
      const propsUserId = this.props.user.user.id;
      const onlyWhiteSpace = !messageInput || !messageInput.match(/[\S]/);
      if (onlyWhiteSpace) return;

      // call database
      createComment(propsUserId, postId, messageInput).then(data => {
        try {
          const feed = data.data.createComment;
          this.setState({ nextComments: this.state.comments.push(feed) });
        } catch (error) {
          throw new Error("data not found");
        }
      });

      return (
        (e.currentTarget.value = null), (e.currentTarget.style.height = "27px")
      );
    }
  };

  // FIX & onChangePostInput like postInput
  onChangePostInput = e => {
    const limit = 3000;
    if (e.currentTarget.value.length > limit) {
      e.currentTarget.value = this.createPostInput;
      return;
    }
    const input = e.currentTarget.value;
    this.createPostInput = input;
  };

  // Need call database
  handleCreatePost = event => {
    // Using Pesimis
    event.preventDefault();
    const propsUserId = this.props.user.user.id;
    const messageInput = this.createPostInput;
    const onlyWhiteSpace = !messageInput || !messageInput.match(/[\S]/);
    if (onlyWhiteSpace) return;

    createPost(propsUserId, messageInput).then(data => {
      try {
        const feed = data.data.createPost;
        const addIconLike = { ...feed, iconLikes: false, commentsRow: false };

        this.createPostInput = "";
        this.setState({ nextPosts: this.state.posts.unshift(addIconLike) });
      } catch (error) {
        throw new Error("data not found");
      }
    });

    this.setState({ reset: true });
    setTimeout(() => this.setState({ reset: false }), 100);
  };

  handleUpdateOrCreateLike = post => {
    const likes = [...this.state.likes];
    const { id } = this.props.user.user;

    if (post.likes) {
      if (post.likes && post.likes.length > 0) {
        const posts = [...this.state.posts];
        const indexStatePosts = _.findIndex(posts, post);
        const objStatePostsLikes = _.groupBy(
          posts[indexStatePosts].likes,
          "creatorLikesId"
        )[id];
        const indexStatePostsLikes = objStatePostsLikes
          ? _.findIndex(posts[indexStatePosts].likes, objStatePostsLikes[0])
          : null;

        const groupPostLikes = _.groupBy(post.likes, "creatorLikesId");
        const alreadyLikes = groupPostLikes[id];
        if (alreadyLikes) {
          const groupStateLike = _.groupBy(likes, "creatorLikesId");
          const indexStateLike = _.findIndex(groupStateLike[id], {
            postId: post.id
          });
          const objLikes = groupStateLike[id][indexStateLike];
          const indexLikes = _.findIndex(likes, objLikes);
          const like = !objLikes.like;

          updateOrCreateLike(id, post.id, like).then(data => {
            try {
              const update = data.data.updateOrCreateLike;
              const bankLikes = [...likes];

              if (objStatePostsLikes) {
                posts[indexStatePosts].likes[indexStatePostsLikes] = update;
                posts[indexStatePosts].iconLikes = update.like;
                this.setState({ posts });
              }

              bankLikes[indexLikes] = update;
              this.setState({ likes: bankLikes });
              return;
            } catch (error) {
              throw new Error("data not found");
            }
          });
        } else {
          const posts = [...this.state.posts];
          const indexPosts = _.findIndex(posts, post);
          const like = true;

          updateOrCreateLike(id, post.id, like).then(data => {
            try {
              const update = data.data.updateOrCreateLike;
              const bankLikes = likes.concat(update);

              posts[indexPosts].likes[0] = update;
              posts[indexStatePosts].iconLikes = update.like;

              this.setState({ likes: bankLikes });
              this.setState({ posts });
              return;
            } catch (error) {
              throw new Error("data not found");
            }
          });
        }
        return;
      } else {
        const posts = [...this.state.posts];
        const indexStatePosts = _.findIndex(posts, post);
        const like = true;

        updateOrCreateLike(id, post.id, like).then(data => {
          try {
            const update = data.data.updateOrCreateLike;
            const bankLikes = likes.concat(update);

            posts[indexStatePosts].likes[0] = update;
            posts[indexStatePosts].iconLikes = update.like;

            this.setState({ likes: bankLikes });
            this.setState({ posts });
            return;
          } catch (error) {
            throw new Error("data not found");
          }
        });
      }
      return;
    }
  };

  getposts(lastId) {
    const username = this.props.match.params.username;
    // console.log("getposts");
    // console.log("lastId", lastId);
    // console.log("username", username);
    getPosts(username, lastId).then(data => {
      try {
        // console.log("handleGetPosts", data);
        const feeds = data.data.getUser;
        const posts = data.data.getUser.somePosts;
        const comments = data.data.getUser.somePosts;
        const likes = data.data.getUser.somePosts;
        const olderPosts = [this.state.posts];
        const olderComments = [this.state.comments];
        const olderLikes = [this.state.likes];

        // Check Duplicate
        const bankFeedsId = [];
        const newerPostsId = [];
        const newerFeeds = posts.map(item => bankFeedsId.push(item.id));
        const olderFeeds = olderPosts[0].map(item => bankFeedsId.push(item.id));
        const uniqueFeedsId = [...new Set(bankFeedsId)];
        const isUnique = bankFeedsId.length === uniqueFeedsId.length;

        // const filerPosts = olderPosts.filter();
        // console.log("filerPosts", filerPosts);
        // console.log("_posts", posts);
        // console.log("_olderPosts", olderPosts);
        // console.log("_uniqueFeedsId", uniqueFeedsId);
        // console.log("_bankFeedsId", bankFeedsId);
        // console.log("_isUnique", isUnique);
        if (!isUnique) {
          return;
        }

        const bankPosts = [];
        const bankComments = [];
        const bankLikes = [];
        const index = feeds.somePosts.length - 1;
        const limit = 10;
        const disableLoad =
          posts.length < limit
            ? this.setState({ disableLoad: true })
            : this.setState({ disableLoad: false });
        const lastId =
          posts.length > 0
            ? this.setState({
                lastId: feeds.somePosts[index].id
              })
            : null;
        const icon = [
          ...posts.map(post => {
            const groupLikes = _.groupBy(post.likes, "creatorLikesId");
            if (groupLikes[this.props.user.user.id]) {
              const isLike = groupLikes[this.props.user.user.id][0].like;
              return { ...post, iconLikes: isLike, commentsRow: false };
            } else if (post.likes.length > 0 || post.likes.length === 0) {
              return { ...post, iconLikes: false, commentsRow: false };
            }
            return null;
          })
        ];
        if (olderPosts.length !== 0) {
          olderPosts[0].map(post => bankPosts.push(post));
        }
        if (olderComments.length !== 0) {
          olderComments[0].map(comment => bankComments.push(comment));
        }
        if (olderLikes.length !== 0) {
          olderLikes[0].map(like => bankLikes.push(like));
        }
        // icon = posts + iconLike property
        icon.map(i => bankPosts.push(i));
        comments.map(c => c.comments.map(item => bankComments.push(item)));
        likes.map(l => l.likes.map(item => bankLikes.push(item)));
        this.setState({
          profile: [feeds.id, feeds.email, feeds.username],
          posts: bankPosts,
          comments: bankComments,
          likes: bankLikes,
          NotFound: false
        });
      } catch (error) {
        // throw error;
        return this.setState({ NotFound: true });
      }
    });
  }

  render() {
    // console.log("this.state in render:", this.state);
    // if (!this.props.user) return <Redirect to="/login" />;
    // if (service.getCurrentUser()) return <Redirect to="/feed" />;

    return (
      <React.Fragment>
        {(!this.props.user || this.state.NotFound) && (
          <ProfileNotFound
            username={this.props.match.params.username}
            login={this.props.user}
          />
        )}

        {!this.state.NotFound && this.props.user && (
          <React.Fragment>
            {/* <div className="backdrop-post"></div> */}
            <div
              className="row"
              // style={{ minWidth: "928px" }}
            >
              <div className="col">
                <ProfileJumbotron
                  user={this.props.user.user}
                  idThisProfile={this.state.profile[0]}
                  emailThisProfile={this.state.profile[1]}
                  usernameThisProfile={this.state.profile[2]}
                />
              </div>
            </div>

            <div
              className="row"
              // style={{ minWidth: "928px" }}
            >
              <div className="col">
                <PostInput
                  reset={this.state.reset}
                  onChangePostInput={this.onChangePostInput}
                  handleCreatePost={this.handleCreatePost}
                  showCreatePost={this.state.showCreatePost}
                />
                <Feed
                  user={this.props.user.user}
                  disableLoad={this.state.disableLoad}
                  posts={this.state.posts}
                  comments={this.state.comments}
                  likes={this.state.likes}
                  createPostInput={this.createPostInput}
                  handleGetPosts={this.handleGetPosts}
                  handleUpdatePost={this.handleUpdatePost}
                  handleDeletePost={this.handleDeletePost}
                  createCommentInput={this.createCommentInput}
                  onChangeCommentInput={this.onChangeCommentInput}
                  handleDeleteComment={this.handleDeleteComment}
                  handleUpdateComment={this.handleUpdateComment}
                  handleCreateComment={this.handleCreateComment}
                  handleOnClickCommentButton={this.handleOnClickCommentButton}
                  handleUpdateOrCreateLike={this.handleUpdateOrCreateLike}
                  handleResetFeed={this.handleResetFeed}
                />
              </div>
              {/* <div className="col-4 m-0 pl-2 p-0">
                <table className="w-100">
                  <tbody className="card card-body card mb-2 p-2">
                    <tr className="border-bottom">
                      <td>
                        <strong>Personal Information</strong>
                      </td>
                    </tr>
                    <tr>
                      <td>Example Detail</td>
                    </tr>
                    <tr>
                      <td>Example Detail</td>
                    </tr>
                    <tr>
                      <td>Example Detail</td>
                    </tr>
                    <tr>
                      <td>Example Detail</td>
                    </tr>
                    <tr>
                      <td>Example Detail</td>
                    </tr>
                    <tr>
                      <td>Example Detail</td>
                    </tr>
                  </tbody>
                </table>
              </div> */}
            </div>
          </React.Fragment>
        )}
      </React.Fragment>
    );
  }
}

export default Profile;
