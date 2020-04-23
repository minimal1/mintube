/** @format */
import routes from "../routes";
import Video from "../models/Video";
import Comment from "../models/Comment";

export const home = async (req, res) => {
  try {
    const videos = await Video.find({}).sort({ _id: -1 });
    res.render("home", {
      pageTitle: "Home",
      videos,
    });
  } catch (error) {
    res.render("home", {
      pageTitle: "Home",
      videos: [],
    });
  }
};
export const search = async (req, res) => {
  const {
    query: { term: searchingBy },
  } = req;

  let videos = [];

  try {
    videos = await Video.find({
      title: { $regex: searchingBy, $options: "i" },
    });

    res.render("search", {
      pageTitle: "Search",
      searchingBy,
      videos,
    });
  } catch (error) {
    console.log(error);
  }
};

export const getUpload = (req, res) =>
  res.render("upload", { pageTitle: "Upload" });

export const postUpload = async (req, res) => {
  const {
    body: { title, description },
    file: { location },
  } = req;
  try {
    const newVideo = await Video.create({
      fileUrl: location,
      title: title,
      description: description,
      creator: req.user.id,
    });
    req.user.videos.push(newVideo.id);
    req.user.save();
    req.flash("success", "Video uploaded");
    res.redirect(routes.videoDetail(newVideo.id));
  } catch (error) {
    req.flash("error", "Can't upload video");
    res.redirect(routes.home);
  }
};

export const videoDetail = async (req, res) => {
  const {
    params: { id },
  } = req;
  try {
    const video = await Video.findById(id)
      .populate("creator")
      .populate("comments");
    res.render("videoDetail", { pageTitle: video.title, video });
  } catch (error) {
    req.flash("error", "Video not found");
    res.redirect(routes.home);
  }
};
export const getEditVideo = async (req, res) => {
  const {
    params: { id },
  } = req;

  try {
    const video = await Video.findById(id);

    if (video.creator !== req.user.id) {
      throw Error();
    } else {
      res.render("editVideo", { pageTitle: `Edit ${video.title}`, video });
    }
  } catch (error) {
    res.redirect(routes.home);
  }
};

export const postEditVideo = async (req, res) => {
  const {
    params: { id },
    body: { title, description },
  } = req;

  try {
    await Video.findOneAndUpdate({ _id: id }, { title, description });
    req.flash("success", "Video updated");
    res.redirect(routes.videoDetail(id));
  } catch (error) {
    req.flash("error", "Can't update video");
    res.redirect(routes.home);
  }
};

export const deleteVideo = async (req, res) => {
  const {
    params: { id },
  } = req;

  try {
    const video = await Video.findById(id);
    if (video.creator !== req.user.id) {
      throw Error();
    } else {
      await Video.findOneAndRemove({ _id: id });
    }
  } catch (error) {
    console.log(error);
  }
  res.redirect(routes.home);
};

export const postRegisterView = async (req, res) => {
  const {
    params: { id },
  } = req;

  try {
    const video = await Video.findById(id);
    video.views += 1;
    video.save();
    res.status(200);
  } catch (error) {
    res.status(400);
  } finally {
    res.end();
  }
};

export const postAddComment = async (req, res) => {
  const {
    params: { id },
    body: { comment },
    user,
  } = req;

  try {
    const video = await Video.findById(id);

    const newComment = await Comment.create({
      text: comment,
      creator: user.id,
    });

    video.comments.push(newComment.id);
    video.save();

    res.status(200);
  } catch (error) {
    res.status(400);
  } finally {
    res.end();
  }
};
