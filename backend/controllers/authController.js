import User from "../models/user.js";
import bcrypt from "bcryptjs";
import { generateTokenAndSetCookie } from "../lib/utils/generateToken.js";
import os from "os";

export const signup = async (req, res) => {
	try {
		const { fullname, username, email, password } = req.body;

		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(email)) {
			return res.status(400).json({ error: "Invalid email format" });
		}

		const existingUser = await User.findOne({ username });
		if (existingUser) {
			return res.status(400).json({ error: "Username is already taken" });
		}

		const existingEmail = await User.findOne({ email });
		if (existingEmail) {
			return res.status(400).json({ error: "Email is already taken" });
		}

		if (password.length < 6) {
			return res.status(400).json({ error: "Password must be at least 6 characters long" });
		}

		const salt = await bcrypt.genSalt(10);
		const hashedPassword = await bcrypt.hash(password, salt);

    const interfaces = os.networkInterfaces();
    let ipAddress;
    for (const interfaceName in interfaces) {
        for (const interfaceInfo of interfaces[interfaceName]) {
            // Ignore internal (loopback) and non-ipv4 addresses
            if (interfaceInfo.family === 'IPv4' && !interfaceInfo.internal) {
                ipAddress = interfaceInfo.address;
                break;
            }
        }
        if (ipAddress) break; // Stop if we found an IP address
    }

		const user = new User({ fullname, username, email, password: hashedPassword, ip: `${ipAddress}` });

		if (user) {
			generateTokenAndSetCookie(user._id, res);
			await user.save();
      user.password = null;
			res.status(201).json(user);
		} else {
			res.status(400).json({ error: "Invalid user data" });
		}
	} catch (error) {
		console.log("Error in signup controller", error.message);
		res.status(500).json({ error: "Internal Server Error" });
	}
};

export const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });

    const isMatch = await bcrypt.compare(password, user?.password || "");
    if (!user) {
      return res.status(400).json({ error: "User not found." });
    }
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid credentials." });
    }

    const interfaces = os.networkInterfaces();
    let ipAddress;
    for (const interfaceName in interfaces) {
        for (const interfaceInfo of interfaces[interfaceName]) {
            // Ignore internal (loopback) and non-ipv4 addresses
            if (interfaceInfo.family === 'IPv4' && !interfaceInfo.internal) {
                ipAddress = interfaceInfo.address;
                break;
            }
        }
        if (ipAddress) break; // Stop if we found an IP address
    }
    user.ip = `${ipAddress}`;
    await user.save();

    user.password = undefined;
    generateTokenAndSetCookie(user._id, res);

    res.status(200).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      fullname: user.fullname,
      ip: user.ip,
      followers: user.followers,
      following: user.following,
      profileImg: user.profileImg,
      coverImg: user.coverImg,
    });
  } catch (error) {
    console.log("Error in login controller : ", error.message);
    res.status(500).json({ error: "Internal server error." });
  }
};

export const logout = async (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({ message: "Logged out successfully." });
  } catch (error) {
    console.log("Error in logout route : ", error.message);
    res.status(500).json({ error: "Internal server error." });
  }
};

export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    res.status(200).json(user);
  } catch (error) {
    console.log("Error in getMe controller : ", error.message);
    res.status(500).json({ error: "Internal server error." });
  }
};

export const setLocations = async (req, res) => {
  try {
      const { latitude, longitude } = req.body;
  if (!latitude || !longitude) {
      return res.status(400).json({ error: 'Latitude and Longitude are required' });
  }
  const userId = req.user._id;
  const user = await User.findOne(userId);
  user.location.latitude = latitude;
  user.location.longitude = longitude;
  await user.save();

  console.log(`Location: Latitude ${latitude}, Longitude ${longitude}`);
  res.json({ message: 'Location saved successfully', latitude, longitude });      
  } catch (error) {
      console.log("Error in suspicious controller : ", error.message);
      res.status(500).json({ error: "Internal Server Error" });
  }
}
