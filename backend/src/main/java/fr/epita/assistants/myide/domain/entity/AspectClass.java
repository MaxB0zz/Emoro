package fr.epita.assistants.myide.domain.entity;

import java.util.ArrayList;
import java.util.List;

import static fr.epita.assistants.myide.domain.entity.Mandatory.Aspects.*;
import static fr.epita.assistants.myide.domain.entity.Mandatory.Features.Any.*;
import static fr.epita.assistants.myide.domain.entity.Mandatory.Features.Git.*;
import static fr.epita.assistants.myide.domain.entity.Mandatory.Features.Maven.*;


public class AspectClass implements Aspect{
    Type type;
    AspectClass(Type typ) {
        type = typ;
    }

    @Override
    public Type getType() {
        return type;
    }

    @Override
    public List<Feature> getFeatureList() {
        List<Feature> res = null;
        res = new ArrayList<Feature>();
        if (type == MAVEN) {
            res.add(new FeatureClass(COMPILE));
            res.add(new FeatureClass(CLEAN));
            res.add(new FeatureClass(TEST));
            res.add(new FeatureClass(PACKAGE));
            res.add(new FeatureClass(INSTALL));
            res.add(new FeatureClass(EXEC));
            res.add(new FeatureClass(TREE));
        }
        else if (type == GIT) {
            res.add(new FeatureClass(PULL));
            res.add(new FeatureClass(ADD));
            res.add(new FeatureClass(COMMIT));
            res.add(new FeatureClass(PUSH));
        }
        res.add(new FeatureClass(DIST));
        res.add(new FeatureClass(CLEANUP));
        res.add(new FeatureClass(SEARCH));

        return res;
    }
}
