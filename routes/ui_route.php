<?php

/*
|--------------------------------------------------------------------------
| Frontend Route
|--------------------------------------------------------------------------
|
*/
return [
    [
        'name'=> '401', 'path'=> '/401'
    ],
    [
        'name'=> '403', 'path'=> '/403'
    ],
    [
        'name'=> '404', 'path'=> '/404'
    ],
    [
        'name'=> 'change-password', 'path'=> '/me/change-password'
    ],
    [
        'name'=> 'example', 'path'=> '/example'
    ],
    [
        'name'=> 'generator', 'path'=> '/generator'
    ],
    [
        'name'=> 'home', 'path'=> '/'
    ],
    [
        'name'=> 'login', 'path'=> '/login'
    ],
    [
        'name'=> 'metas', 'path'=> '/metas'
    ],
    [
        'name'=> 'metas-add', 'path'=> '/metas/form'
    ],
    [
        'name'=> 'metas-detail', 'path'=> '/metas/:id'
    ],
    [
        'name'=> 'metas-edit', 'path'=> '/metas/form/:id'
    ],
    [
        'name'=> 'notifications', 'path'=> '/me/notifications'
    ],
    [
        'name'=> 'permissions', 'path'=> '/permissions'
    ],
    [
        'name'=> 'permissions-add', 'path'=> '/permissions/form'
    ],
    [
        'name'=> 'permissions-detail', 'path'=> '/permissions/:id'
    ],
    [
        'name'=> 'permissions-edit', 'path'=> '/permissions/form/:id'
    ],
    [
        'name'=> 'role-groups', 'path'=> '/role-groups'
    ],
    [
        'name'=> 'role-groups-add', 'path'=> '/role-groups/form'
    ],
    [
        'name'=> 'role-groups-detail', 'path'=> '/role-groups/:id'
    ],
    [
        'name'=> 'role-groups-edit', 'path'=> '/role-groups/form/:id'
    ],
    [
        'name'=> 'role-permissions', 'path'=> '/role-permissions'
    ],
    [
        'name'=> 'role-permissions-add', 'path'=> '/role-permissions/form'
    ],
    [
        'name'=> 'role-permissions-detail', 'path'=> '/role-permissions/:id'
    ],
    [
        'name'=> 'role-permissions-edit', 'path'=> '/role-permissions/form/:id'
    ],
    [
        'name'=> 'roles', 'path'=> '/roles'
    ],
    [
        'name'=> 'roles-add', 'path'=> '/roles/form'
    ],
    [
        'name'=> 'roles-detail', 'path'=> '/roles/:id'
    ],
    [
        'name'=> 'roles-edit', 'path'=> '/roles/form/:id'
    ],
    [
        'name'=> 'settings', 'path'=> '/settings'
    ],
    [
        'name'=> 'update-profile', 'path'=> '/me/update-profile'
    ],
    [
        'name'=> 'users', 'path'=> '/users'
    ],
    [
        'name'=> 'users-add', 'path'=> '/users/form'
    ],
    [
        'name'=> 'users-detail', 'path'=> '/users/:id'
    ],
    [
        'name'=> 'users-edit', 'path'=> '/users/form/:id'
    ],
];
