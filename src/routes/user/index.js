const express = require("express");
const router = express.Router();
const validator = require("../../helpers/validator");
const { authenticateToken } = require("../../middleware/auth.middleware");

const post = require("./post");
const get = require("./get");
const getById = require("./getById");
const update = require("./update");
const deleted = require("./delete");

/**
 * @swagger
 * /v1/users/add:
 *   post:
 *     summary: Add a new user
 *     description: Endpoint to add a new user.
 *     tags:
 *       - Users
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *                 description: The first name of the user
 *               lastName:
 *                 type: string
 *                 description: The last name of the user
 *               professionalTitle:
 *                 type: string
 *                 description: The professional title of the user
 *               phone:
 *                 type: string
 *                 description: The phone number of the user
 *               email:
 *                 type: string
 *                 format: email
 *                 description: The email address of the user
 *               license:
 *                 type: string
 *                 description: The license of the user
 *               password:
 *                 type: string
 *                 format: password
 *                 description: The password of the user
 *               profileImage:
 *                 type: string
 *                 format: binary
 *                 description: The profile image of the user
 *     responses:
 *       '201':
 *         description: User added successfully
 *       '400':
 *         description: Bad request, validation error
 *       '409':
 *         description: Conflict, phone number or email already exists
 *       '500':
 *         description: Internal server error
 */

router.post("/add", validator("body", post.rule), post.handler);
/**
 * @swagger
 * /v1/users/get:
 *   post:
 *     summary: Get users with pagination and filtering
 *     description: Retrieve a list of users with pagination and filtering options.
 *     tags:
 *       - Users
 *     parameters:
 *       - in: query
 *         name: pageNumber
 *         required: false
 *         description: The page number for pagination
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: pageSize
 *         required: false
 *         description: The number of users per page
 *         schema:
 *           type: integer
 *           default: 20
 *       - in: query
 *         name: search
 *         required: false
 *         description: Search term to filter users by email, first name, last name, phone, professional title, or license
 *         schema:
 *           type: string
 *           default: ""
 *       - in: query
 *         name: status
 *         required: false
 *         description: |
 *           Status of users:
 *           - 1: Active
 *           - 2: Deactive
 *           - 3: Deleted
 *         schema:
 *           type: integer
 *           enum: [1, 2, 3]
 *           default: 1
 *     responses:
 *       '200':
 *         description: Successfully retrieved the list of users
 *       '400':
 *         description: Bad request, validation error
 *       '500':
 *         description: Internal server error
 */
router.post("/get",validator("body", get.rule), get.handler);

/**
 * @swagger
 * /v1/users/getById:
 *   post:
 *     summary: Get user by ID
 *     description: Endpoint to retrieve a user by their ID
 *     tags:
 *       - Users
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserGetByIdRequest'
 *     responses:
 *       '200':
 *         description: Successfully retrieved the user
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       '404':
 *         description: User not found
 *       '500':
 *         description: Internal server error
 * components:
 *   schemas:
 *     UserGetByIdRequest:
 *       type: object
 *       properties:
 *         UserId:
 *           type: string
 *           description: The ID of the user to retrieve
 *           example: 6090b9e97ab0df001f78f66e
 *     User:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: The ID of the user
 *         firstName:
 *           type: string
 *           description: The first name of the user
 *         lastName:
 *           type: string
 *           description: The last name of the user
 *         phone:
 *           type: string
 *           description: The phone number of the user
 *         email:
 *           type: string
 *           description: The email address of the user
 *         profileImage:
 *                 type: string
 *                 format: binary
 *                 description: The profile image of the user
 *
 */
router.post("/getById",validator("body", getById.rule),getById.handler);
/**
 * @swagger
 * /v1/users/update:
 *   post:
 *     summary: Update user information
 *     description: Endpoint to update user information.
 *     tags:
 *       - Users
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *                 description: The first name of the user
 *               lastName:
 *                 type: string
 *                 description: The last name of the user
 *               phone:
 *                 type: string
 *                 description: The phone number of the user
 *               email:
 *                 type: string
 *                 format: email
 *                 description: The email address of the user
 *               password:
 *                 type: string
 *                 format: password
 *                 description: The password of the user
 *               profileImage:
 *                 type: string
 *                 format: binary
 *                 description: The profile image of the user
 *     responses:
 *       '200':
 *         description: User information updated successfully
 *       '400':
 *         description: Bad request, validation error
 *       '404':
 *         description: Not found, user with provided ID does not exist
 *       '500':
 *         description: Internal server error
 * components:
 *   schemas:
 *     UserUpdateRequest:
 *       type: object
 *       properties:
 *         firstName:
 *           type: string
 *           description: The updated first name of the user
 *         lastName:
 *           type: string
 *           description: The updated last name of the user
 *         phone:
 *           type: string
 *           description: The updated phone number of the user
 *         email:
 *           type: string
 *           description: The updated email address of the user
 *         password:
 *           type: string
 *           description: The updated password of the user
 *     User:
 *       type: object
 *       properties:
 *         firstName:
 *           type: string
 *           description: The first name of the user
 *         lastName:
 *           type: string
 *           description: The last name of the user
 *         phone:
 *           type: string
 *           description: The phone number of the user
 *         email:
 *           type: string
 *           description: The email address of the user
 */
router.post("/update",validator("body", update.rule),update.handler);

/**
 * @swagger
 * /v1/users/delete:
 *   post:
 *     summary: Delete a user
 *     description: Endpoint to delete a user by user ID
 *     tags:
 *       - Users
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/DeleteUserRequest'
 *     responses:
 *       '200':
 *         description: User deleted successfully
 *       '404':
 *         description: User not found, unable to locate data associated with the provided ID
 *       '500':
 *         description: Internal server error
 * components:
 *   schemas:
 *     DeleteUserRequest:
 *       type: object
 *       properties:
 *         userId:
 *           example: 6090b9e97ab0df001f78f66e
 *           type: string
 *           minLength: 24
 *           maxLength: 24
 *           description: The ID of the user to be deleted
 */

router.post("/delete",validator("body", deleted.rule),deleted.handler);

module.exports = router;