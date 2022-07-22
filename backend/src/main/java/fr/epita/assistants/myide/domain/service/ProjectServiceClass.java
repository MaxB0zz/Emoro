package fr.epita.assistants.myide.domain.service;

import fr.epita.assistants.myide.domain.entity.*;

import javax.validation.constraints.NotNull;
import java.nio.file.Path;

public class ProjectServiceClass implements ProjectService {
    NodeService nodeService;

    @Override
    public Project load(Path root) {
        Node rootNode = new NodeClass(root, Node.Types.FOLDER);
        ProjectClass project = new ProjectClass(rootNode);
        nodeService = new NodeServiceClass(project);
        // nodeService.create(rootNode, null, Node.Types.FOLDER);

        return project;
    }

    @Override
    public Feature.ExecutionReport execute(Project project, Feature.Type featureType, Object... params) {
        for (@NotNull Feature feat : project.getFeatures()) {
            if (feat.type() == featureType) {
                return feat.execute(project, params);
            }
        }
        return () -> false;
    }

    @Override
    public NodeService getNodeService() {
        return nodeService;
    }
}
