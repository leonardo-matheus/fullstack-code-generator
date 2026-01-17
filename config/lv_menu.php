<?php
/** Front End Menus */

return [
    /*
    |--------------------------------------------------------------------------
    | Default Menu in Front End
    |--------------------------------------------------------------------------
    |
    | This list menu front consume in front end, you can add or remove this menu
    |
    */
    [
        'title' => 'Home',
        'route' => 'home',
        'icon' => 'home',
    ],
    [
        'title' => 'Generator',
        'route' => null,
        'icon' => 'auto_awesome',
        'children' => [
            [
                'title' => 'Module Wizard',
                'route' => 'generator',
                'icon' => 'add_box',
            ],
            [
                'title' => 'Advanced Editor',
                'route' => 'generator-legacy',
                'icon' => 'edit_note',
            ],
            [
                'title' => 'Code Output',
                'route' => 'code-output',
                'icon' => 'code',
            ],
        ]
    ],
    [
        'title' => 'Components',
        'route' => 'example',
        'icon' => 'widgets',
    ],
    [
        'title' => 'Management',
        'route' => null,
        'icon' => 'manage_accounts',
        'permissions' => [
            'permissions-browse',
            'role-groups-browse',
            'roles-browse',
            'users-browse',
        ],
        'children' => [
            [
                'title' => 'Permissions',
                'route' => 'permissions',
                'icon' => 'assignment_turned_in',
                'permissions' => ['permissions-browse']
            ],
            [
                'title' => 'Role Groups',
                'route' => 'role-groups',
                'icon' => 'perm_contact_calendar',
                'permissions' => ['role-groups-browse']
            ],
            [
                'title' => 'Roles',
                'route' => 'roles',
                'icon' => 'admin_panel_settings',
                'permissions' => ['roles-browse']
            ],
            [
                'title' => 'Users',
                'route' => 'users',
                'icon' => 'group',
                'permissions' => ['users-browse'],
            ],
        ]
    ],
    [
        'title' => 'Settings',
        'route' => 'settings',
        'icon' => 'tune',
        'permissions' => ['global-settings']
    ],
];