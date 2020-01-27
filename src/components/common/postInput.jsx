import React from "react";
import TextareaAutosize from "react-textarea-autosize";

const PostInput = ({
  handleCreatePost,
  onChangePostInput,
  reset,
  showCreatePost
}) => {
  return (
    <React.Fragment>
      {showCreatePost && (
        <React.Fragment>
          <div className="d-flex card-body card mb-3 p-0">
            <form onSubmit={handleCreatePost} name="createPostInput">
              <div className="form-group modal-body mb-0">
                {reset && (
                  <TextareaAutosize
                    className="form-control fixed post-form"
                    id="createPost"
                    placeholder="What do you think?"
                    minRows={3}
                    maxRows={20}
                    value=""
                  />
                )}
                {!reset && (
                  <TextareaAutosize
                    className="form-control fixed post-form"
                    id="createPost"
                    placeholder="What do you think?"
                    minRows={3}
                    maxRows={20}
                    onChange={onChangePostInput}
                  />
                )}
              </div>
              <div className="modal-footer pt-0 pb-0">
                <button type="submit" className="btn btn-primary">
                  Post
                </button>
              </div>
            </form>
          </div>
        </React.Fragment>
      )}
    </React.Fragment>
  );
};

export default PostInput;
