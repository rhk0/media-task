import Media from "../models/media.js";  // Use ES module import

export const uploadMedia = async (req, res) => {
  try {
    // Determine media type based on file mimetype
    let mediaType = "";
    if (req.file.mimetype.startsWith("image")) {
      mediaType = "image";
    } else if (req.file.mimetype.startsWith("video")) {
      mediaType = "video";
    } else {
      return res.status(400).json({ message: "Unsupported file type" });
    }

    const media = new Media({
      filename: req.file.filename,
      url: `/uploads/${req.file.filename}`,
      type: mediaType,  // Set the media type here
      user: req.user.id,
    });

    await media.save();
    res.status(201).json(media);
  } catch (err) {
    res.status(500).json({ message: "Error uploading media" });
  }
};

export const getMedia = async (req, res) => {
  try {
    const media = await Media.find({ user: req.user.id });
    res.json(media);
  } catch (err) {
    res.status(500).json({ message: "Error fetching media" });
  }
};

export const deleteMedia = async (req, res) => {
  try {
    // Find the media by ID
    const media = await Media.findById(req.params.id);
    if (!media) {
      return res.status(404).json({ message: "Media not found" });
    }

    // Delete the media
    await media.deleteOne(); // Correct method for deletion in Mongoose v6+

    res.json({ message: "Media deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting media" });
  }
};

