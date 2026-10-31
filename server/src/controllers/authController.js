const bcrypt = require("bcrypt");
const User = require("../models/User");
const generateToken = require("../utils/generateToken");
const hasValidAdminBootstrapKey = require("../utils/hasValidAdminBootstrapKey");

const register = async (req, res) => {
    try {
        const { name, email, password, admin } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "Name, email and password are required",
            });
        }

        if (admin !== undefined && typeof admin !== "boolean") {
            return res.status(400).json({
                success: false,
                message: "Admin must be a boolean",
            });
        }

        let grantAdmin = false;
        if (admin === true) {
            if (!process.env.ADMIN_BOOTSTRAP_KEY) {
                return res.status(503).json({
                    success: false,
                    message: "Admin bootstrap is not configured on the server",
                });
            }
            if (!hasValidAdminBootstrapKey(req.get("x-admin-bootstrap-key"))) {
                return res.status(401).json({
                    success: false,
                    message: "A valid admin bootstrap key is required to create an admin",
                });
            }
            if (await User.exists({ admin: true })) {
                return res.status(409).json({
                    success: false,
                    message: "Admin bootstrap is disabled because an admin already exists",
                });
            }
            grantAdmin = true;
        }

        let user = await User.findOne({
            email: email.toLowerCase(),
        }).select("+password");

        if (user && !grantAdmin) {
            return res.status(409).json({
                success: false,
                message: "User already exists",
            });
        }

        if (user && grantAdmin) {
            const passwordMatches = await bcrypt.compare(password, user.password);
            if (!passwordMatches) {
                return res.status(401).json({
                    success: false,
                    message: "Invalid email or password",
                });
            }
            user.name = name;
            user.admin = true;
            await user.save();
        } else {
            const hashedPassword = await bcrypt.hash(password, 12);
            user = await User.create({
                name,
                email: email.toLowerCase(),
                password: hashedPassword,
                admin: grantAdmin,
            });
        }

        const token = generateToken(user._id);

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        return res.status(201).json({
            success: true,
            message: "Account created successfully",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                admin: user.admin === true,
            },
        });
    } catch (error) {
        console.error("Register error:", error);

        return res.status(500).json({
            success: false,
            message: "Something went wrong",
        });
    }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const user = await User.findOne({
      email: email.toLowerCase(),
    }).select("+password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const isPasswordValid = await bcrypt.compare(
      password,
      user.password
    );

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const token = generateToken(user._id);

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      success: true,
      message: "Login successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
          admin: user.admin === true,
      },
    });
  } catch (error) {
    console.error("Login error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};


const getCurrentUser = async (req, res) => {
  return res.status(200).json({
    success: true,
    user: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      admin: req.user.admin === true,
    },
  });
};

const logout = async (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });

  return res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
};

const bootstrapAdmin = async (req, res) => {
  try {
    const { email, admin } = req.body;
    if (admin !== true || typeof email !== "string" || !email.trim()) {
      return res.status(400).json({
        success: false,
        message: "A valid email and admin: true are required",
      });
    }

    if (await User.exists({ admin: true })) {
      return res.status(409).json({
        success: false,
        message: "Admin bootstrap is disabled because an admin already exists",
      });
    }

    const user = await User.findOneAndUpdate(
      { email: email.trim().toLowerCase() },
      { $set: { admin: true } },
      { new: true },
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Register this user before granting admin access",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Admin access granted",
      user: { id: user._id, name: user.name, email: user.email, admin: true },
    });
  } catch (error) {
    console.error("Admin bootstrap error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Could not grant admin access",
    });
  }
};

module.exports = {
    register,
    login,
    getCurrentUser,
    logout,
    bootstrapAdmin,
};


