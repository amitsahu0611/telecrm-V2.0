/** @format */

const MenuDataForUser = `  SELECT mm.id, mm.name, mm.url, mm.short_order, mm.parent_id, mm.submenu, mm.is_active, mm.icon, 
         ml.create, ml.read, ml.updates, ml.delete, mm.is_menu
  FROM menu_masters AS mm
  INNER JOIN menu_lists AS ml ON mm.id = ml.menu_id
  INNER JOIN users ON ml.user_id = users.user_id
  WHERE users.is_deleted = 0
    AND users.role_id NOT IN (0)
    AND users.user_id = :user_id;`;

const GetAllTasks = `SELECT 
        t.task_id,
        t.client_id,
        c.full_name AS client_name,
        t.task_name,
        t.description,
        t.priority,
        t.status,
        t.due_date,
        t.fees,
        t.advance,
        t.balance,
        t.related_department,
        t.is_completed,
        t.is_active,
        t.is_deleted,
        t.created_by,
        ta.assigned_to,
        u1.full_name AS assigned_person,
        ta.assigned_by,
        u2.full_name AS assigned_by_person,
        cs.case_id,
        cs.file_number,
        cs.case_number
      FROM
        tasks t
        JOIN clients c ON t.client_id = c.client_id
        JOIN task_assigns ta ON t.task_id = ta.task_id
        JOIN users u1 ON ta.assigned_to = u1.user_id
        JOIN users u2 ON ta.assigned_by = u2.user_id
        JOIN cases cs ON t.case_id = cs.case_id
      WHERE
        t.is_deleted = 0
      ORDER BY
        t.task_id;`;

const GetSingleTask = `
      SELECT 
        t.task_id,
        t.client_id,
        c.full_name AS client_name,
        t.task_name,
        t.description,
        t.priority,
        t.status,
        t.due_date,
        t.fees,
        t.advance,
        t.balance,
        t.related_department,
        t.is_completed,
        t.is_active,
        t.is_deleted,
        t.created_by,
        ta.assigned_to,
        u1.full_name AS assigned_person,
        ta.assigned_by,
        u2.full_name AS assigned_by_person,
        cs.case_id,
        cs.file_number,
        cs.case_number
      FROM
        tasks t
       Left JOIN clients c ON t.client_id = c.client_id
       Left JOIN task_assigns ta ON t.task_id = ta.task_id
       Left JOIN users u1 ON ta.assigned_to = u1.user_id
       Left JOIN users u2 ON ta.assigned_by = u2.user_id
		Left JOIN cases cs ON t.case_id = cs.case_id
      WHERE
        t.is_deleted = 0
        AND t.task_id = :task_id
      ORDER BY
        t.task_id;
    `;

const GetTemplateSingleTask = `
  IF :template_id = 0 THEN
    SELECT 
        tasks.task_name,
        tasks.description,
        tasks.start_date,
        tasks.due_date,
        tasks.status,
        tasks.client_id,
        tasks.task_id,
        tasks.sort_order,
        tasks.task_prefix,
        clients.file_no
    FROM
        tasks
    INNER JOIN
        clients ON tasks.client_id = clients.client_id
    WHERE
        tasks.client_id = :client_id
        AND tasks.is_deleted = 0
        AND tasks.task_id IN (:task_ids)
    GROUP BY
    tasks.task_id
    ORDER BY
        tasks.sort_order;

ELSE
    SELECT
        ct.id,
        ct.template_id,
        tasks.task_name,
        ct.dependent_task_id,
        ct.sort_order,
        ct.compilation_day,
        tasks.description,
        tasks.start_date,
        tasks.due_date,
        tasks.status,
        tasks.client_id,
        tasks.task_id,
        clients.file_no,
        tasks.sort_order,
        tasks.task_prefix
    FROM
        case_template_details AS ct
    INNER JOIN
        tasks ON ct.template_id = tasks.template_id
    INNER JOIN
        clients ON tasks.client_id = clients.client_id
    WHERE
        tasks.client_id = :client_id
        AND tasks.is_deleted = 0
        AND tasks.template_id = :template_id
        AND tasks.task_id IN (:task_ids)
    GROUP BY
    tasks.task_id
    ORDER BY
        tasks.sort_order;
END IF;
`;


const GetAllTemplateSingleTask = `
  SELECT 
    ct.id,
    ct.template_id,
    case_templates.template_name, 
    tasks.task_name, 
    ct.dependent_task_id, 
    ct.sort_order, 
    ct.compilation_day, 
    tasks.description, 
    tasks.start_date, 
    tasks.due_date,
    tasks.status,
    tasks.client_id,
    tasks.task_id,
    clients.file_no
FROM 
    case_template_details AS ct
inner JOIN 
    tasks ON ct.template_id = tasks.template_id
inner JOIN
    clients ON tasks.client_id = clients.client_id
inner JOIN
    case_templates ON ct.template_id = case_templates.id
WHERE 
    tasks.task_prefix = 'step_task' 
	AND tasks.is_deleted = 0
    AND tasks.status <> 'Completed'  
GROUP BY 
    tasks.task_id
ORDER BY 
    tasks.due_date;

`;

const GetFilteredTemplateSingleTask = `
   SELECT 
    ct.id,
    ct.template_id,
    case_templates.template_name, 
    tasks.task_name, 
    ct.dependent_task_id, 
    ct.sort_order, 
    ct.compilation_day, 
    tasks.description, 
    tasks.start_date, 
    tasks.due_date,
    tasks.status,
    tasks.client_id,
    tasks.task_id,
    clients.file_no
FROM 
    case_template_details AS ct
INNER JOIN 
    tasks ON ct.template_id = tasks.template_id AND tasks.is_deleted = false
INNER JOIN
    clients ON tasks.client_id = clients.client_id
INNER JOIN
    case_templates ON ct.template_id = case_templates.id
WHERE 
    tasks.task_prefix = 'step_task' 
    AND tasks.status = :status
    AND tasks.status <> 'Completed'  
GROUP BY 
    tasks.task_id
ORDER BY 
    tasks.due_date;

`;

const PrefixTask = `
SELECT
    ct.id AS template_id,
    ct.template_name,
    tasks.status,
    MAX(users.full_name) AS full_name,
    MAX(tasks.createdAt) AS createdAt,
    MAX(tasks.start_date) AS start_date,
    tasks.client_id,
    GROUP_CONCAT(tasks.task_id) AS task_ids
FROM
    tasks
LEFT JOIN
    case_templates AS ct ON ct.id = tasks.template_id
INNER JOIN
    users ON tasks.created_by = users.user_id
WHERE
    tasks.client_id = :client_id
    AND tasks.is_deleted = false
    AND tasks.template_id != 0
GROUP BY
    ct.id, ct.template_name, tasks.client_id

UNION ALL

SELECT
    0 AS template_id,
    'Without Template' AS template_name,
    tasks.status, -- Include status for differentiation
    MAX(users.full_name) AS full_name,
    MAX(tasks.createdAt) AS createdAt,
    MAX(tasks.start_date) AS start_date,
    tasks.client_id,
    GROUP_CONCAT(tasks.task_id) AS task_ids
FROM
    tasks
INNER JOIN
    users ON tasks.created_by = users.user_id
WHERE
    tasks.client_id = :client_id
    AND tasks.is_deleted = false
    AND tasks.template_id = 0
GROUP BY
    tasks.client_id, users.full_name; 

`;

const TaskInfoHistory = `
SELECT 
    th.id, 
    th.task_name,
    th.task_status,
    users.full_Name, 
    th.task_info_id,
    th.createdAt,
    th.comments
FROM 
    task_template_histories AS th
INNER JOIN 
    users ON th.user_id = users.user_id
WHERE 
    th.task_info_id = :task_info_id
GROUP BY
    th.id,
    th.task_name,
    users.full_Name,
    th.task_info_id,
    th.createdAt
ORDER BY 
    th.createdAt DESC;

`;

const TaskInfoHistoryByFileNo = `
SELECT
    th.id,
    th.task_name,
    th.task_status,
    users.full_Name,
    th.task_info_id,
    th.createdAt,
    th.comments
FROM
    task_template_histories AS th
INNER JOIN
    users ON th.user_id = users.user_id
WHERE
    th.File_no = :File_no
ORDER BY
    th.createdAt DESC;

`;
module.exports = {
    MenuDataForUser,
    GetAllTasks,
    GetSingleTask,
    GetTemplateSingleTask,
    PrefixTask,
    GetAllTemplateSingleTask,
    TaskInfoHistory,
    GetFilteredTemplateSingleTask,
    TaskInfoHistoryByFileNo
};
