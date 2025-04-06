// Mock in-memory store
const projects = {};

function generateId() {
    return Math.random().toString(36).substr(2, 9);
}

module.exports = function (app) {
    app.route('/api/issues/:project')
        // GET: View issues
        .get((req, res) => {
            const project = req.params.project;
            const issues = projects[project] || [];
            const filters = req.query;

            let filteredIssues = [...issues];
            Object.keys(filters).forEach(key => {
                if (key === 'open') {
                    filteredIssues = filteredIssues.filter(issue =>
                        issue[key] === (filters[key] === 'true'));
                } else {
                    filteredIssues = filteredIssues.filter(issue =>
                        issue[key] === filters[key]);
                }
            });

            res.json(filteredIssues);
        })

        // POST: Create issue
        .post((req, res) => {
            const project = req.params.project;
            const { issue_title, issue_text, created_by, assigned_to = '', status_text = '' } = req.body;

            if (!issue_title || !issue_text || !created_by) {
                return res.json({ error: 'required field(s) missing' });
            }

            const newIssue = {
                _id: generateId(),
                issue_title,
                issue_text,
                created_by,
                assigned_to,
                status_text,
                created_on: new Date(),
                updated_on: new Date(),
                open: true
            };

            if (!projects[project]) projects[project] = [];
            projects[project].push(newIssue);
            res.json(newIssue);
        })

        // PUT: Update issue
        .put((req, res) => {
            const project = req.params.project;
            const { _id, ...updates } = req.body;

            if (!_id) {
                return res.json({ error: 'missing _id' });
            }

            if (Object.keys(updates).length === 0) {
                return res.json({ error: 'no update field(s) sent', '_id': _id });
            }

            const issues = projects[project] || [];
            const issue = issues.find(i => i._id === _id);

            if (!issue) {
                return res.json({ error: 'could not update', '_id': _id });
            }

            Object.assign(issue, updates, { updated_on: new Date() });
            res.json({ result: 'successfully updated', '_id': _id });
        })

        // DELETE: Delete issue
        .delete((req, res) => {
            const project = req.params.project;
            const { _id } = req.body;

            if (!_id) {
                return res.json({ error: 'missing _id' });
            }

            const issues = projects[project] || [];
            const issueIndex = issues.findIndex(i => i._id === _id);

            if (issueIndex === -1) {
                return res.json({ error: 'could not delete', '_id': _id });
            }

            issues.splice(issueIndex, 1);
            res.json({ result: 'successfully deleted', '_id': _id });
        });
};
