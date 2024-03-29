import db from '../models/index';

const createNewRoles = async (roles) => {
    try {
        const currentRoles = await db.Role.findAll({
            attributes: ['url', 'description'],
            raw: true,
        });

        const persist = roles.filter(({ url: url1 }) => !currentRoles.some(({ url: url2 }) => url1 === url2));

        await db.Role.bulkCreate(persist);

        if (persist.length === 0) {
            return {
                EM: 'Nothing to create!',
                EC: 0,
                DT: [],
            };
        } else {
            return {
                EM: `Create ${persist.length} roles success...!`,
                EC: 0,
                DT: [],
            };
        }

        // await db.Role.bulkCreate(roles);
    } catch (e) {
        console.log('>>check Error: ', e);
        return {
            EM: `Something wrong from server!`,
            EC: -1,
            DT: [],
        };
    }
};

const getAllRoles = async () => {
    try {
        let data = await db.Role.findAll({
            attributes: ['id', 'url', 'description'],
            raw: true,
        });

        return {
            EM: `Get all success!`,
            EC: 0,
            DT: data,
        };
    } catch (e) {
        console.log('>>>check error: ', e);
        return {
            EM: `Something wrong from server!`,
            EC: -1,
            DT: [],
        };
    }
};

const deleteRole = async (data) => {
    try {
        if (data.url === '/role/create') {
            return {
                EM: `Can't delete func create roles!`,
                EC: -2,
                DT: [],
            };
        } else {
            await db.Role.destroy({
                where: {
                    id: data.id,
                },
            });

            return {
                EM: `Delete role success!`,
                EC: 0,
                DT: [],
            };
        }
    } catch (e) {
        console.log('>>>check error: ', e);
        return {
            EM: `Something wrong from server!`,
            EC: -1,
            DT: [],
        };
    }
};

const getRoleByGroup = async (id) => {
    try {
        if (!id) {
            return {
                EM: `Missing not found any role!`,
                EC: 0,
                DT: null,
            };
        } else {
            let role = await db.Group.findOne({
                where: { id: id },
                include: { model: db.Role, attributes: ['id', 'url'] },
            });

            return {
                EM: `Get role by group success!`,
                EC: 0,
                DT: role,
            };
        }
    } catch (e) {
        console.log('>>>check error getRoleByGroup: ', e);
        return {
            EM: `Something wrong from server!`,
            EC: -1,
            DT: [],
        };
    }
};

const assignRoleToGroup = async (data) => {
    try {
        await db.Group_Role.destroy({
            where: { groupId: +data.groupId },
        });

        await db.Group_Role.bulkCreate(data.groupRoles);
        return {
            EM: 'Assign roles to group success!',
            EC: 0,
            DT: [],
        };
    } catch (e) {
        console.log('>>>check error assignRoleToGroup: ', e);
        return {
            EM: `Something wrong from server!`,
            EC: -1,
            DT: [],
        };
    }
};

module.exports = {
    createNewRoles,
    getAllRoles,
    deleteRole,
    getRoleByGroup,
    assignRoleToGroup,
};
