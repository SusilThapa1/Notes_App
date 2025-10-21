const axios = require("axios");
const UAParser = require("ua-parser-js");
const Users = require("../models/userModel");
const crypto = require("crypto");

//  1. Get Public IP (handles local IPs too)
const getPublicIP = async (req) => {
  let ip = req.ip;
  if (["::1", "127.0.0.1"].includes(ip) || ip.startsWith("192.168.") || ip.startsWith("10.")) {
    try {
      const { data } = await axios.get("https://api64.ipify.org?format=json");
      ip = data.ip;
    } catch {
      ip = "8.8.8.8";
    }
  }
  return ip;
};

//  2. Get Device & Browser Info
const parseDeviceInfo = (userAgent) => {
  const parser = new UAParser(userAgent);
  return {
    deviceName: parser.getOS().name || parser.getDevice().model || "Unknown Device",
    browserName: parser.getBrowser().name || "Unknown Browser",
  };
};

//  3. Get Geo Location (optional)
const getGeoLocation = async (ip) => {
  try {
    const { data } = await axios.get(
      // `https://api.findip.net/${ip}/?token=${process.env.LOCATION_API_KEY}`
      `http://ip-api.com/json/${ip}`
    );
    console.log("ip data:",data)
    return {
      country: data?.country|| "unknown",
      countryCode: data?.countryCode || "unknown",
      province: data?.region|| "unknown",
      provinceName:data?.regionName ||"unknown",
      city: data?.city  || "unknown",
      lat: data?.lat || null,
      lon: data?.lon || null,
      isp:data?.isp || "unknown"
    };
  } catch {
    return null;
  }
};

//  4. Generate or Reuse Device ID (ensure not reused across users)
const getOrCreateDeviceId = async (req, userId) => {
  let deviceId = req.cookies.deviceId;
  const existingOwner = deviceId ? await Users.findOne({ "sessions.deviceId": deviceId }) : null;

  if (!deviceId || (existingOwner && existingOwner._id.toString() !== userId.toString())) {
    deviceId = crypto.randomUUID();
  }

  return deviceId;
};

//  5. Create or Update Session for this device
const updateUserSession = (user, deviceId, sessionData) => {
  const existingSession = user.sessions.find((s) => s.deviceId === deviceId);

  if (existingSession) {
    Object.assign(existingSession, { ...sessionData, lastActiveAt: new Date() });
  } else {
    user.sessions.push({
      deviceId,
      ...sessionData,
      loginAt: new Date(),
      lastActiveAt: new Date(),
    });
  }
};

// Export helpers
module.exports = {
  getPublicIP,
  parseDeviceInfo,
  getGeoLocation,
  getOrCreateDeviceId,
  updateUserSession,
};
